import { Component, OnInit } from '@angular/core';
import { User } from './interfaces/user';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private users: User[] = [];
  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUsers()
    .subscribe(users => this.users = users);
  }
}
