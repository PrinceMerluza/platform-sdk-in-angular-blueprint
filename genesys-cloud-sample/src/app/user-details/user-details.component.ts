import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userDetails?: platformClient.Models.UserMe;
  userAvatar?: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
   this.getUserDetails();
  }

  getUserDetails(){
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) return;
    
    this.genesysCloudService.getUserDetails(id)
      .subscribe(userDetails => {
        this.userDetails = userDetails
        this.userAvatar = userDetails.images?.[userDetails.images.length - 1]
                          .imageUri;
      });
  }
}
