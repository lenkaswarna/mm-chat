import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Group } from '../interfaces/group';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { ChatService } from '../chat.service';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private groups: Group[] = [];
  private users: User[] = [];
  private messages: Message[] = [];
  private message: FormGroup;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private groupService: GroupService
  ) {
  }

  ngOnInit(): void {
    this.getMessage();
    this.getGroup();
    this.message = this.fb.group({
      _id: null, // message id
      receiverId: [''],
      receiverType: ['group'], // group or individual
      senderId: [''],
      picUrl: [''], // image of the sender or receiver
      text: [''], // message data
      type: ['text'], // type of the message(checkbox, radio, image, video, etc)
      status: ['delivered'], // delivered, read, not-delivered
      contentType: [''], // for radio, checkbox and slider
      contentData: {
        data: [''] // for radio, checkbox and slider
      },
      responseData: {
        data: [''] // for radio, checkbox and slider
      },
      lastUpdateTime: Date.now()
    });
  }

  getMessage() {
    this.chatService.getMessages()
    .subscribe(msg => this.messages = msg);
  }

  sendMessage({ value, valid }: { value: Message, valid: boolean }): void {
    const result = JSON.stringify(value);
    console.log(result);
    if (!result) {
      return;
    } else {
      this.chatService.sendMessage(value)
      .subscribe(msg => { this.messages.push(msg); console.log(msg); });
    }
  }

  getGroup() {
    this.groupService.getGroups()
    .subscribe(groups => this.groups = groups);
  }
}
