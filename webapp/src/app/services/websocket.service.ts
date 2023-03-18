import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: any;
  constructor(private storage: Storage) {
    // this.storage.get('access_token').then((usertoken) => {
    //   console.log(usertoken);
      
    // });

    this.socket = io(environment.backend, {
      transports: ['websocket', 'polling', 'flashsocket'],
      extraHeaders: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBRE1JTiIsImNvZGUiOiJBRE1JTiIsImRlc2NyaXB0aW9uIjoiQURNSU5TVFJBVE9SIFJPTEUiLCJjcmVhdGVkQXQiOiIyMDIwLTAzLTEzVDE4OjU5OjQ5LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAzLTE1VDIxOjU4OjEyLjAwMFoifSwiaWF0IjoxNjc5MDM5MzQ5LCJleHAiOjE2NzkxMjU3NDl9.YOeKMkBZ4yInybi36PRHLBTa5g0FOO8jNJO0Qv4Rxlw',
      }
    });
    // this.socket.auth = { usertoken: usertoken ? usertoken : 'notregistered' };
    this.socket.connect();
  }
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
