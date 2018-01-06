import { Component } from '@angular/core';
import { Group } from './interfaces/group';
import { Message } from './interfaces/message';
import { User } from './interfaces/user';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private groups: Group[] = [
    {
      'id': Date.now(),
      'name': 'ABC',
      'url': 'groupABC',
      'description': 'Sample group',
      'picture': 'http://blog.ebta.nu/wp-content/uploads/2012/05/group.png',
      'userIds': '12arun',
      'createdBy': '12arun',
      'updatedBy': '12arun',
      'createdTime': Date.now(),
      'updatedTime': Date.now()
    },
    {
      'id': Date.now(),
      'name': 'Meeting',
      'url': 'groupMeeting',
      'description': 'Meetups group',
      'picture': 'http://harbingergroup.com/wp-content/uploads/2014/05/harbinger_htvpl-new01.jpg',
      'userIds': '13kiran',
      'createdBy': '13kiran',
      'updatedBy': '13kiran',
      'createdTime': Date.now(),
      'updatedTime': Date.now()
    },
    {
      'id': Date.now(),
      'name': 'NASA',
      'url': 'groupNASA',
      'description': 'Scientific discovery',
      'picture': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/NASA_Astronaut_Group_18.jpg',
      'userIds': '14sagar',
      'createdBy': '14sagar',
      'updatedBy': '14sagar',
      'createdTime': Date.now(),
      'updatedTime': Date.now()
    }
  ];
  private users: User[] = [
    {
      'id': Date.now(),
      'name': 'Arun',
      'email': 'arun@awnics.com',
      'phoneNo': '8970074777',
      'picUrl': 'http://www.onsiteinspecting.com/wp-content/uploads/2016/02/male-user.png',
      'description': 'Software developer',
      'status': 'available',
      'waitingTime': 4,
      'rating': 3,
      'token': 'adffrafsdfe324edqww32', // token generated to activate the user
      'actviate': 1, // either 0 or 1(default is 0)
      'privilege': 'user', // user or admin privilege
      'createdTime': Date.now(),
      'createdBy': 'Arun',
      'updatedTime': Date,
      'updatedBy': 'Arun'
    }
  ];
  private messages: Message[] = [];
  // private socket;
  constructor( ) {
    const socket = io('http://localhost:3000/');
    //skt.on('connect', this.onConnect);
  }

}
