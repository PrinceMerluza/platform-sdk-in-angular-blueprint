import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-user-list-entry',
  templateUrl: './user-list-entry.component.html',
  styleUrls: ['./user-list-entry.component.css']
})
export class UserListEntryComponent implements OnInit {
  @Input() user!: platformClient.Models.User;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  goToAgentDetails(id: string){
    this.router.navigate(['/user', id]);
  }  
}
