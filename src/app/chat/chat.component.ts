import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Group } from '../interfaces/group';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { ChatService } from '../chat.service';
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @Input() user: User;
  private newUsers = [];
  private groups: Group[] = [];
  private users: User[] = [];
  private messages: Message[] = [];
  private message: FormGroup;
  private groupId: number;
  private typingTimerLength= 500;
  private typing = false ;
  private lastTypingTime;
  private typingTimer;
  private timeDiff;
  private oldGroupId = 1;
  private offset = 0;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private groupService: GroupService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.getGroup();
    this.createForm();
  }

  createForm() {
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
    // this.socketService.reciveMessages(message);
  }

 /* onkeydown(event) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        // $currentInput.focus();
        if (event == 13) {
            if (userId) {
             this.socketService.stopeTyping();
              this.typing = false;
            }else {
               console.log('this is not a vlid id');
            }

        }
      }
   }
   onKey(event) {
     if ( !this.typing) {
       this.typing = true;
      this.socketService.typing();
     }
     this.lastTypingTime = (new Date()).getTime();
     setTimeout(function(){
      this.typingTimer = (new Date()).getTime();
      this.timeDiff = this.lastTypingTime - this.typingTimer;
      if (this.timeDiff >= this.typingTimerLength && this.typing) {
        this.socketService.stopeTyping();
        this.typing = false;
      }
     }, this.typingTimerLength);
   }*/
  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  sendMessage({ value, valid }: { value: Message, valid: boolean }): void {
    const result = JSON.stringify(value);
    const userId = +this.route.snapshot.paramMap.get('userId');
    const groupId = this.chatService.getGroupId();
    value.receiverId = groupId;
    value.senderId = userId;
    console.log(result);
    if (!result) {
      return;
    } else {
     // this.messages.push(value);
      this.chatService.sendMessage(value)
        .subscribe(msg => { this.messages.push(msg); console.log(msg); });
        this.socketService.sendMessage(value);
    }
    this.message.reset();
  }

  getGroup() {
    const userId = +this.route.snapshot.paramMap.get('userId');
    if (userId == null) {
      console.log('give correct userdetails');
    } else {
      // connecting to socket service.
      this.socketService.connSocket(userId);
    this.groupService.getGroups(userId)
      .subscribe(groups => this.groups = groups);
  }
}

  getMessage(groupId) {
    this.chatService.setGroupId(groupId);
    const userId = +this.route.snapshot.paramMap.get('userId');
    const size = 5;
    if (this.oldGroupId === groupId) {
      this.chatService.getMessages(userId, groupId, this.offset, size)
        .subscribe((msg) => {
          msg.reverse().map((message) => {
            this.messages.push(message);
          });
          this.socketService.joinGroup(groupId);
      this.socketService.getMessages();
        });
    } else {
      this.messages = [];
      this.offset = 0;
      this.oldGroupId = groupId;
      this.chatService.getMessages(userId, groupId, this.offset, size)
        .subscribe((msg) => {
          msg.reverse().map((message) => {
            this.messages.push(message);
          });
          this.socketService.joinGroup(groupId);
      this.socketService.getMessages();
        });
    }
  }

  onScroll(event) {
    const position = event.target.scrollTop;
    if (position === 0) {
      this.offset = this.offset + 20;
      this.getMessage(this.chatService.getGroupId());
    }
  }

  scrollToBottom() {
    const height = document.getElementById('messageBox');
    height.scrollTop = height.scrollHeight;
  }
}
