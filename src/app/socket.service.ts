import {Injectable} from '@angular/core';
import { Message } from './interfaces/message';
import * as io from 'socket.io-client';

const socket = io('http://localhost:3000/'); 
@Injectable()
export class SocketService {
    constructor() {
    }
    socketConnection() {}
    // for sending a message
    sendMessage(message: Message) {
    socket.io(message.receiverId).emit('send-message', message);
    }
    // when a user 1st time join a group
 }