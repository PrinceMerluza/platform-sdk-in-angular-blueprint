import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as platformClient from 'purecloud-platform-client-v2';

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();

  isAuthorized = new BehaviorSubject<boolean>(false);

  constructor() {
    this.client.setPersistSettings(true);
  }

  // TODO: Set Genesys Cloud region
  loginImplicitGrant(): Promise<void> {
    return this.client.loginImplicitGrant(
        environment.GENESYS_CLOUD_CLIENT_ID, 
        environment.REDIRECT_URI)
    .then(data => {
      this.isAuthorized.next(true);
      console.log('User authorized.')
    })
    .catch(e => console.error(e));
  }

  // TODO: Add check if isAuhorized
  getUserDetails(): Observable<platformClient.Models.UserMe> {
    return from(this.usersApi.getUsersMe());
  }
}
