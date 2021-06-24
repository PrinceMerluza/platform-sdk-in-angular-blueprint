import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from './genesys-cloud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Yeti Another Sample App';
  isAuthorized = false;

  constructor(
    private genesysCloudService : GenesysCloudService,
    private route: ActivatedRoute,
  ){ }

  async ngOnInit(){
    const language = this.route.snapshot.queryParamMap.get('language');
    const environment = this.route.snapshot.queryParamMap.get('environment');

    this.genesysCloudService.isAuthorized.subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
    });

    await this.genesysCloudService.initialize(language, environment);
  }
}
