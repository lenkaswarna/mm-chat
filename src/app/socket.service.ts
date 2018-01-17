import { Injectable } from '@angular/core';
import { Message } from './interfaces/message';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private socket;
    private URL = 'http://localhost:3000';
    private groups= [];
    constructor() {
        // this.socket = io.connect('http://localhost:3000');
    }
    // Socket connection based on userId
    connSocket(userId) {
        this.socket = io(this.URL, { query: `userId=${userId}` });
    }
    // when user join 1st tyme to a group
    joinGroup(groupId) {
        console.log('join group called', groupId);
        this.socket.emit('joinGroup', groupId);
        this.socket.on('updateGroup', groupid => {
            console.log(groupId);
            this.socket.emit('updateGroup', ' you have connected in' + groupid + 'group');
          //  document.getElementById('textarea').innerHTML = '';
        });
    }
    // for sending a message
    sendMessage(message: Message) {
        this.socket.emit('send-message', message);
        // console.log('socket message' + JSON.stringify(message));
    }

    getMessages() {
        this.socket.on('recive-message', message => {
            console.log('message is recived' + message.text);
            this.socket.emit('recive-message', message.text);
        });
    }
    typing() {
        this.socket.emit('typing');
    }
    stopTyping() {
      this.socket.emit('stop typing');
    }
}
