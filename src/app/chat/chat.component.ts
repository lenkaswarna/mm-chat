import { Component, OnInit, Input, EventEmitter, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Group } from '../interfaces/group';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { ChatService } from '../chat.service';
import { GroupService } from '../group.service';
import { WINDOW } from '../window.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() user: User;
  private groups: Group[] = [];
  private users: User[] = [];
  private messages: Message[] = [];
  private message: FormGroup;
  private groupId: number;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {
  }

  ngOnInit(): void {
    this.getGroup();
    this.onWindowScroll();
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

  sendMessage({ value, valid }: { value: Message, valid: boolean }): void {
    const result = JSON.stringify(value);
    const userId = +this.route.snapshot.paramMap.get('userId');
    const groupId = this.getGroupId();
    value.receiverId = groupId;
    value.senderId = userId;
    console.log(result);
    if (!result) {
      return;
    } else {
      this.chatService.sendMessage(value)
      .subscribe(msg => { this.messages.push(msg); console.log(msg); });
    }
    document.getElementById('textarea').innerHTML = '';
  }

  getGroup() {
    const userId = +this.route.snapshot.paramMap.get('userId');
    this.groupService.getGroups(userId)
    .subscribe(groups => this.groups = groups);
  }

  getMessage(groupId) {
    this.setGroupId(groupId);
    const userId = +this.route.snapshot.paramMap.get('userId');
    const offset = 0;
    const size = 20;
    this.chatService.getMessages(userId, groupId, offset, size)
    .subscribe(msg => this.messages = msg.reverse());
  }

  setGroupId(groupId) {
    this.groupId = groupId;
  }

  getGroupId() {
    return this.groupId;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    console.log(offset);
  }
}
