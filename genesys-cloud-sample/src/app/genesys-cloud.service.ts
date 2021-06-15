import { Injectable } from '@angular/core';
import * as platformClient from 'purecloud-platform-client-v2';

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  client = platformClient.ApiClient.instance;
  
  constructor() { }
}
