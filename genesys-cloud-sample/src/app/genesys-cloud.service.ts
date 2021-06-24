import { Injectable } from '@angular/core';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  language: string = 'en-us';
  environment: string = 'mypurecloud.com';
  accessToken = '';

  isAuthorized = new BehaviorSubject<boolean>(false);
  presenceDefinitions: platformClient.Models.OrganizationPresence[] = [];

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
    // this.client.setPersistSettings(true);
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

    return from(this.usersApi.postUsersSearch(searchBody))
      .pipe(map(data => data.results || []));
  }
}
