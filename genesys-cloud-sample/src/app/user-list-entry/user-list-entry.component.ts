import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as platformClient from 'purecloud-platform-client-v2';
import { GenesysCloudService } from '../genesys-cloud.service';

@Component({
  selector: 'app-user-list-entry',
  templateUrl: './user-list-entry.component.html',
  styleUrls: ['./user-list-entry.component.css']
})
export class UserListEntryComponent implements OnInit {
  @Input() user!: platformClient.Models.User;

  presenceDefinitions: platformClient.Models.OrganizationPresence[] = [];
  languageLabel = 'en_US'; // TODO: Add support for other locale

  constructor(
    private router: Router,
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.presenceDefinitions = this.genesysCloudService.presenceDefinitions;
  }

  onPresenceChange(presenceId: string){
    this.genesysCloudService.setUserPresence(this.user.id!, presenceId)
      .subscribe(data => { console.log('Update presence.') });
  }

  logoutUser() {
    this.genesysCloudService.logoutUser(this.user.id!)
      .subscribe(() => console.log('Logged out user.'));
  }

  goToAgentDetails(id: string){
    this.router.navigate(['/user', id]);
  }  
}
