import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
import * as io from 'socket.io-client';
//import { LoginPage } from '../login/login'

/** Contains URL of the team's server */
const SERVER_URL = "https://ice-server.herokuapp.com/";

@Component({
  selector: 'page-test',
  templateUrl: 'test.html'
})
export class TestPage {
  username: string;
  messages:any = [];
  socketHost: string = SERVER_URL;
  socket:any;
  chat:any;
  //username:string;
  zone:any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private http:Http) {
    this.username = localStorage.getItem('username');
    this.http = http;
    this.socket = io.connect(this.socketHost);
    this.socket.on("msg", function(msg){
      console.log(msg);
    })
    //this.zone = new NgZone({enableLongStackTrace: false});

  }

  doSomething() {
      this.socket.emit('login', "Peter1");
  }
  doSomething2() {
      this.socket.emit('login', "Peter2");
  }
  doSomething3() {
      this.socket.emit('msg', "Peter1");
  }
}
