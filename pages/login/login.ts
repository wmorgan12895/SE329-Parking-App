import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';
import { CreateAccountPage } from '../createaccount/createaccount';
import { BackgroundGeolocation } from 'ionic-native';
import { Platform } from 'ionic-angular';


const SERVER_URL = "https://ice-server.herokuapp.com/";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
/**
 * Class that handles the interaction for the login page
 */
export class LoginPage {
  username: string;
  password: string;

  /**
   * constucts the page
   * @param navCtrl - controls the navigation between pages
   * @param alertCtrl - displays alerts
   * @param params - allows parameters to be passed between pages
   * @param http - allows http requests to be sent to the server
   */
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, private http:Http, public plt: Platform) {
    this.username = "";
    this.password = "";
    this.http = http;
  }

  /**
   * function called when the login button is clicked. checks to see if the login information is valid.
   * alerts the user if invalid, otherwise routs the user to the tabs page
   */
  login(event) {
    if (this.username != "" && this.password != "") {
      //post request for username and password
      let body = JSON.stringify({
      username: this.username,
      password: this.password
      });
      localStorage.clear();

      this.http.post(SERVER_URL + "login", body)
      .subscribe(res => {
        //successful login
        if(res["_body"] !== ""){
          //store all the user info in local storage
          let info = JSON.parse(res["_body"]);
          localStorage.setItem('username', this.username);
          localStorage.setItem('fname', info.fname);
          localStorage.setItem('lname', info.lname);
          localStorage.setItem('blocked', JSON.stringify(info.blocked));
          localStorage.setItem('picture', info.profilePicture);
          let interestString = JSON.stringify({
            interests: info.interests
          });
          localStorage.setItem('interests', interestString);
          localStorage.setItem('password', this.password);
          console.log("login matches");
          console.log(info.todaysMatches);
          this.checkTodaysMatches(info.todaysMatches);
          //Start bg geolocation service
          this.startLocation(this.username);
          //set local storage username
          this.navCtrl.push(TabsPage, {
          });
        }
        else{
          this.badLoginAlert();
        }
      });
         }
    else {
      this.loginAlert();
    }
  }

  /**
   * alerts the user if their username or password is invalid
   */
  loginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Incorrect Login!',
      subTitle: 'Please enter a username and a password',
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * alerts the user if their password is incorrect
   */
  badLoginAlert() {
    let alert = this.alertCtrl.create({
      title: 'Incorrect Login!',
      subTitle: 'Username or Password is incorrect',
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * routs user to the createaccount page
   */
  register(event) {
    localStorage.clear();
      this.navCtrl.push(CreateAccountPage, {
    });
  }

  checkTodaysMatches(todaysMatches) {
    let date = new Date().getDay();
    let month = new Date().getMonth();
    for(var i = 0; i < todaysMatches.length; i++) {
      console.log(todaysMatches[i].date.day);
      if(date != todaysMatches[i].date.day || month != todaysMatches[i].date.month) {
        todaysMatches.splice(i, 1);
        i--;
      }
    }
    localStorage.setItem('todaysMatches', JSON.stringify(todaysMatches));
    let body = {
      username: this.username,
      todaysMatches: todaysMatches
    }
    this.http.post(SERVER_URL + "uploadMatches", body).subscribe(res => {

    }, error => {
      console.log("todaysMatches failed");
    })
  }

  /**
   * starts the geolocation service for the specified user
   * @param username - the user's username
   */
  startLocation(username){
    // BackgroundGeolocation is highly configurable. See platform specific configuration options
    let config = {
            desiredAccuracy: 10,
            stationaryRadius: 10,
            distanceFilter: 20,
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: true, // enable this to clear background location settings when the app terminates
            httpHeaders: { 'username': username },
            url: 'https://ice-server.herokuapp.com/setLocation',
            maxLocations: 1
    };
    BackgroundGeolocation.configure((location) => {
         console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          if (this.plt.is('ios')) {
            BackgroundGeolocation.finish(); // FOR IOS ONLY
          }
     }, (error) => {
       console.log('BackgroundGeolocation error');
     }, config);
    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start();
  }

}
