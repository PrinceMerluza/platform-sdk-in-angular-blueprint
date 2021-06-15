import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private genesysCloudService: GenesysCloudService) { }

  ngOnInit(): void {
    console.log(this.genesysCloudService.client);
  }

}
