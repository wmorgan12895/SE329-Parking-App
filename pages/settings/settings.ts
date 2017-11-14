import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
//import { LoginPage } from '../login/login'

/** Contains URL of the team's server */
const SERVER_URL = "https://ice-server.herokuapp.com/";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  username: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private http:Http) {
    this.username = localStorage.getItem('username');
    this.http = http;
  }

  changePassword(event) {
    let prompt = this.alertCtrl.create({
      title: 'Change Password',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Old Password',
          type: 'password'
        },
        {
          name: 'password',
          placeholder: 'New Password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            var hasNum = data.password.match(/\d+/g);
            if (hasNum == null || data.password.length < 8) {
              this.passwordAlert();
            }

            if (data.oldPassword !== localStorage.getItem('password')){
              this.oldPasswordAlert();
            }

            else{
              let body = JSON.stringify({
              username: this.username,
              password: data.password,
              });

              localStorage.setItem('password', data.password);

              this.http.post(SERVER_URL + "changePassword", body).subscribe(res => {});
            }
          }
        }
      ]
    });
    prompt.present();
  }

  /**
  * Alerts the user if their password does not meet the requirements
  */
  passwordAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Please use a password with at least 8 characters, one of them being a number',
      buttons: ['OK']
    });
    alert.present();
  }

  /**
  * Alerts the user if their password does not meet the requirements
  */
  oldPasswordAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'Old password is incorrect',
      buttons: ['OK']
    });
    alert.present();
  }

  logOut(event) {
      localStorage.clear();
      location.reload();
  }

}
