import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from './genesys-cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Yeti Another Sample App';
  isAuthorized = false;

  constructor(private genesysCloudService : GenesysCloudService){ }

  async ngOnInit(){
    this.genesysCloudService.isAuthorized.subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
    });

    await this.genesysCloudService.loginImplicitGrant();
  }
}
