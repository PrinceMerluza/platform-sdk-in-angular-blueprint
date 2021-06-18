import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/userdetails', pathMatch: 'full' },
  { path: 'userdetails', component: UserDetailsComponent },
  { path: 'agentmanager', component: AgentManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
