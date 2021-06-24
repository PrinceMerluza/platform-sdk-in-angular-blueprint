import { Injectable } from '@angular/core';
import { Observable, from, of, BehaviorSubject, queue } from 'rxjs';
import { catchError, defaultIfEmpty, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as platformClient from 'purecloud-platform-client-v2';

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();
  private presenceApi = new platformClient.PresenceApi();
  private routingApi = new platformClient.RoutingApi();
  private analyticsApi = new platformClient.AnalyticsApi();

  language: string = 'en-us';
  environment: string = 'mypurecloud.com';
  accessToken = '';

  isAuthorized = new BehaviorSubject<boolean>(false);
  presenceDefinitions: platformClient.Models.OrganizationPresence[] = [];
  lastSearchedTerm = '';

  constructor(private http: HttpClient) {}

  private loginImplicitGrant(): Promise<void> {
    return this.client.loginImplicitGrant(
        environment.GENESYS_CLOUD_CLIENT_ID, 
        environment.REDIRECT_URI)
    .then(data => {
      this.accessToken = data.accessToken;
      this.isAuthorized.next(true);
      console.log('User authorized.')
    })
    .catch(e => console.error(e));
  }

  initialize(language: string|null, environment: string|null): Promise<void> {
    this.client.setPersistSettings(true);
    if(environment) this.client.setEnvironment(environment);

    return this.loginImplicitGrant()
    .then(() => this.presenceApi.getPresencedefinitions())
    .then(data => {
      if(!data.entities) return;

      this.presenceDefinitions = data.entities
          .filter(p => !(p.systemPresence === 'Offline' || p.systemPresence === 'Idle'));
    })
    .catch(e => console.error(e));
  }

  // TODO: Add check if isAuhorized
  getUserDetails(id: string): Observable<platformClient.Models.User> {
    return from(this.usersApi.getUser(id, { 
        expand: ['routingStatus', 'presence'],
      }));
  }

  getUserMe(): Observable<platformClient.Models.UserMe> {
    return from(this.usersApi.getUsersMe({ 
        expand: ['routingStatus', 'presence'],
      }));
  }

  getUserQueues(userId: string): Observable<platformClient.Models.UserQueue[]> {
    return from(this.routingApi.getUserQueues(userId, { joined: true }))
            .pipe(map(data => data.entities || []));
  }

  getQueueObservations(queueId: string): Observable<platformClient.Models.QueueObservationDataContainer>{
    return from(this.analyticsApi.postAnalyticsQueuesObservationsQuery({
      filter: {
        type: 'or',
        predicates: [
         {
          type: 'dimension',
          dimension: 'queueId',
          operator: 'matches',
          value: queueId
         }
        ]
       },
       metrics: [ 'oOnQueueUsers', 'oActiveUsers' ]
    }))
    .pipe(
      map(data => {
        const result = data.results?.find(r => r.group?.queueId === queueId); 
        if(!result) throw new Error(`No results queried for ${queueId}`);

        return result;
      }),
    );
  }

  setUserPresence(userId: string, presenceId: string): Observable<platformClient.Models.UserPresence> {
    return from(this.presenceApi.patchUserPresencesPurecloud(
        userId, 
        { presenceDefinition: { id: presenceId } }
      ));
  }

  logoutUser(userId: string) {
    return this.http.delete(
      `https://api.${this.environment}/api/v2/apps/users/${userId}/logout`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        })
      });
  }

  searchUsers(term: string): Observable<platformClient.Models.User[]> {
    if(!term.trim()){
      return of([]);
    }

    let searchBody = {
      sortOrder: 'SCORE',
      pageSize: 25,
      pageNumber: 1,
      expand: ['routingStatus', 'presence'],
      query: [{
        type: 'TERM',
        fields: ['name', 'email'],
        value: term,
        operator: 'AND'
      }]
    };

    this.lastSearchedTerm = term

    return from(this.usersApi.postUsersSearch(searchBody))
      .pipe(map(data => data.results || []));
  }
}
