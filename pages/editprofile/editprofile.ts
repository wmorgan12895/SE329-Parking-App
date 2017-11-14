import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { Camera } from 'ionic-native';

/** Contains URL of the team's server */
const SERVER_URL = "https://ice-server.herokuapp.com/";
/** Used to access default cordova file directories */
declare var cordova: any;

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditProfilePage {
  /** Contains user's entered first name*/
  fname: string;
  /** Contains user's entered last name*/
  lname: string;
  /** Contains user's entered username*/
  username: string;
  /** Contains user's entered password*/
  password: string;
  lastImage: string = null;
  picture: string;
  blocked: any[];


  /**
  * @param navCtrl Used to move between pages
  * @param platform Checks OS the app is being ran on
  * @param alertCtrl Enables pop up alerts
  * @param params skrrt
  * @param http Used for communication to server
  */
  constructor(public platform: Platform, public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, private http:Http) {
    this.username = localStorage.getItem('username');
    this.password = "";
    this.fname = "";
    this.lname = "";
    this.picture = "";
    this.http = http;
  }

  /**
  * The 'continue' button. Checks how the fields were entered and reacts accordingly
  */
  next(event) {
    //checks which fields are to be changed
    if (this.fname != "" && this.lname != "" && this.picture != "") {

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('fname', this.fname);
      localStorage.setItem('lname', this.lname);
      localStorage.setItem('picture', this.picture);


      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if (this.fname != "" && this.lname != "") {

      this.picture = localStorage.getItem('picture');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('fname', this.fname);
      localStorage.setItem('lname', this.lname);

      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if (this.fname != "" && this.picture != "") {

      this.lname = localStorage.getItem('lname');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('fname', this.fname);
      localStorage.setItem('picture', this.picture);


      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if (this.lname != "" && this.picture != "") {

      this.fname = localStorage.getItem('fname');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      lname: this.lname,
      fname: this.fname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('lname', this.lname);
      localStorage.setItem('picture', this.picture);

      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if (this.fname != "") {

      this.lname = localStorage.getItem('lname');
      this.picture = localStorage.getItem('picture');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('fname', this.fname);

      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if (this.lname != "") {

      this.fname = localStorage.getItem('fname');
      this.picture = localStorage.getItem('picture');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      lname: this.lname,
      fname: this.fname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('lname', this.lname);

      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});

      this.navCtrl.push(ProfilePage, {});
    }

    else if(this.picture != "") {

      this.fname = localStorage.getItem('fname');
      this.lname = localStorage.getItem('lname');

      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      fname: this.fname,
      lname: this.lname,
      profilePicture: this.picture
      });

      //set local storage
      localStorage.setItem('picture', this.picture);

      this.http.post(SERVER_URL + "editProfile", body)
      .subscribe(res => {});
      this.navCtrl.push(ProfilePage, {});
    }

  }

  /**
  * Saves picture taken or chosen to app storage and sets lastImage equal to it
  * @param sourceType Tells the method if the picture is coming from the camera or photo library
  */
  takePicture(sourceType){
   Camera.getPicture({
       destinationType: Camera.DestinationType.DATA_URL,
       targetWidth: 300,
       targetHeight: 400,
       sourceType: sourceType
   }).then((imageData) => {
       this.picture = "data:image/jpeg;base64," + imageData;
       localStorage.setItem('picture', this.picture);
   }, (err) => {
       console.log(err);
   });
 }

}
