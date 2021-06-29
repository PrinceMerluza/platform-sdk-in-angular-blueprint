import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { UserListEntryComponent } from './user-list-entry/user-list-entry.component';
import { HomeComponent } from './home/home.component';
import { QueueDetailsComponent } from './queue-details/queue-details.component';
import { PresencePickerComponent } from './presence-picker/presence-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    AgentManagerComponent,
    UserListEntryComponent,
    HomeComponent,
    QueueDetailsComponent,
    PresencePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
