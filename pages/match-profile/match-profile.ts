import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Messaging } from '../../providers/messaging';

const SERVER_URL = "https://ice-server.herokuapp.com/";

/**
* Match Profile Page
*/
@Component({
  selector: 'page-match-profile',
  templateUrl: 'match-profile.html'
})
export class MatchProfilePage {

  profile: any;           // Holds matched profile
  commended: boolean;     // Conditional variable for commending
  reported: boolean;      // Conditional variable for reporting

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public alertCtrl: AlertController,
              private messaging: Messaging) {
    this.profile = navParams.get('profile');
    this.http = http;
    this.commended = false;
    this.reported = false;
  }
  /**
   * commendUser
   * Sends server a request to commend matched user
   * @returns boolean value indicating success
   */
  commendUser(){
   // if(!this.commended){
      let body = JSON.stringify({
        toUsername: this.profile.username,
        fromUsername: localStorage.getItem('username')
      });
      this.http.post("https://ice-server.herokuapp.com/commendUser",body).subscribe(res => {
        if(res["_body"] !== ""){
          this.commended = true;
          let alert = this.alertCtrl.create({
            title: 'User commended!',
            buttons: ['OK']
          });
          alert.present();
          return true;
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'User already commended!',
            buttons: ['OK']
          });
          alert.present();
        }
      }, error => {
        console.log("Error encountered while contacting server!");
        return false;
      });
   //}

  }

  /**
   * reportUser
   * Sends server a request to report matched user
   * @returns boolean value indicating success
   */

  reportUser(){
    // Allows user to report only once (per login)
    if(!this.reported){
      // Put username in JSON object
      let fromStorage = localStorage.getItem('blocked');
      let blocked = JSON.parse(fromStorage);
      blocked.push(this.profile.username);
      let storage = JSON.stringify(blocked);
      localStorage.setItem('blocked', storage);
      let body = JSON.stringify({
        toUsername: this.profile.username,
        fromUsername: localStorage.getItem('username')
      });
      console.log('6');
      // Send JSON object to server
      this.http.post("https://ice-server.herokuapp.com/reportUser",body).subscribe(res => {
        //*** If post was successful ***//
        console.log('http post successful')
        // Set conditional variable to true to only allow one report
        this.reported = true;
        // Create alert to notify user of success
        let alert = this.alertCtrl.create({
          title: 'User reported!',
          buttons: ['OK']
        });
        // Send alert to user
        alert.present();
        // Return to previous page
        this.navCtrl.pop();
      }, error => {
        //*** If post failed ***//
        console.log("Error encountered while contacting server!");
        return false;
      });
    }
    // If match has already been reported
    else{
      // Create alert
      let alert = this.alertCtrl.create({
        title: 'User already reported!',
        subTitle: 'Please contact the police if this user is making you feel unsafe',
        buttons: ['OK']
      });
      // Send alert to user
      alert.present();
    }
  }

  alertUser() {
    this.messaging.alertUser(this.profile.username);
  }

}
