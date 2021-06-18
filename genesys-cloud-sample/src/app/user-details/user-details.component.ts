import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetails?: platformClient.Models.UserMe;
  userAvatar?: string; // TODO: Default userAvatar 

  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
   this.getUserDetails();
  }

  getUserDetails(){
    this.genesysCloudService.getUserDetails()
      .subscribe(userDetails => {
        this.userDetails = userDetails
        this.userAvatar = userDetails.images?.[userDetails.images.length - 1]
                          .imageUri;
      });
  }
}
