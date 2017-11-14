import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { InterestsPage } from '../interests/interests';
import { Camera } from 'ionic-native';

/** Contains URL of the team's server */
const SERVER_URL = "https://ice-server.herokuapp.com/";
/** Used to access default cordova file directories */
declare var cordova: any;

@Component({
  selector: 'page-createaccount',
  templateUrl: 'createaccount.html'
})
export class CreateAccountPage {
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
    this.username = "";
    this.password = "";
    this.fname = "";
    this.lname = "";
    this.http = http;
    this.picture = "";
    /*
    *test image "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCABkAEsDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAgQAAwUGAQf/xAAzEAACAQMDAgQEBQMFAAAAAAABAgADESEEEjEiQQVRYXEGEzKBobHB0fAUkeEjJGKC8f/EABgBAAMBAQAAAAAAAAAAAAAAAAABAwIE/8QAHBEBAQACAwEBAAAAAAAAAAAAAAECESExQQNR/9oADAMBAAIRAxEAPwDhRbvCsOYPBtCFoBOGEMQDyIQgDCXsOYakC1+fMCCBj2hBb8gmAN6dkZgAwv5GOIoDAkdN8+0RpU9lUEhtp59M8/lLtQlVwVQrZWwWz2z2m4xV1RvluUsjNnhufSQUqDDc1NQTyMcw9FpWSmxqMG3cALj+Zlppqh2ikCB6CMnM1EDm6jP5yvKmxwZsvSoUKW57ED+YHnFKlA6lTUuEc/SnpObHNawi3AllIXfPaQaeqTb5bX9o7p9C9gWBANjKsKkUtgcR2hT9LdsyxKCrx3x7RmnTUk2UEzUhWhCtYXAI9RLadIIqgW25IHFscQqdwBYEkcZ5zDCbQt93n7xk8poVp29bkA4BhkEcI/2wIa9SZGBjpzCCA5Zal/SMnLu7Vqm58AfSvlGKNO4uQbQqFFG6jeXu4VQEFpxZXyOmcKmqChUVr49THHfe5ZLlCLLMqu+9ySRtX8TGdNqGSgqWJHN+J0/PetI5yb2e2oxFwFF+3l/LS2ko3gIfqF7eUROuVVO0kE8Dy/f/ADLNLq3q2BIBvjEow0ArMAAeTnm5PeGyHpBVRxgdh/LyIXYqBYtYG9rH1+3MMoALAEg8Zyfcf3gAgFVyTuByR+sEb7dDWXsMfqZatwTYW8/I9p4GVQASw9AT+0A55Nyr0MCO4JxK6rPexG3zzeP0fD9fWsKWle/cheJVqfCNfTuaundQOcTnxx/V7WfTX51QJY7R5RrYCQhcKo+onFhG9Ppfk0bEFWb+8seipADKM9rZOZfHhK8soAM303vzHtDS31tw+lBc5llLw4NUPUUUHMcp0/6IqEAamTm5yPxzGyZdGKE9N+CM9r9pYFuVFUhSMg2z65lNN0YdLLsIN8ZMd8NomvrKKkixbjPA8vtANTw3wVaoWvqhYW6U9PWbS6WgqgCigA/4iWjiezFqil1VVsoAEzdXYqRePV6mDMuubmJqMbV6ZXfcAN3tzE61GrT44wAf8zVrckwcFDCWwXGVl02OwG4LLm5+0IoW3Mtgo6eny5J/9hVxuB289xKAwUkLzgWAlJZUrjYKp0mynbttusPzmv8ADgWtr95vemhzMKtUZy20lkU5Iva/a83/AIUYf7n/AK/rC9CdurE9laNcQ5Ntm1GLRKu3Mz3+ItMBYLUPuAPzmfqPiGmR00834vA9tCq0qFSxiCeKUqou11v5yz5wOQQR6RVqJq+k7xwcGZ1dluGa9r5tH6rb6ZB4Mx69SysCciKdnZuNhdZp10fyaSjawt7wPhTWlPEjTZjaolvuP4ZgCrYFr5A7G0s0FZqWoWqhAZDcYm9p2Pq1J7wzUN+JzWj8arDYtWgKhYbr0mzb2P7xpvFNM7bmr16RPKGmcfhA3AVBYyq53GSSMqZXhV7Wgmq9JhsNpJI6PD2m1D1QQ9sCZ+tP+uR5ySSfqnhAseL94xpiQbeckkcTrrvh9y2m6rHbgH7Td2gySRm//9k=";
    */
  }

  /**
  * The 'continue' button. Checks how the fields were entered and reacts accordingly
  */
  next(event) {
    if (this.fname != "" && this.lname != "" && this.username != "" && this.password != "") {

      var hasNum = this.password.match(/\d+/g);
      if (hasNum == null || this.password.length < 8) {
        this.passwordAlert();
      }

      else{
      //store/pass on entered information
      let body = JSON.stringify({
      username: this.username,
      password: this.password,
      fname: this.fname,
      lname: this.lname,
      picture: this.picture
      });

      this.http.post(SERVER_URL + "checkUsername", body)
      .subscribe(res => {
        if(res["_body"]==="Unused Username"){
          //set local storage
          localStorage.setItem('username', this.username);
          localStorage.setItem('fname', this.fname);
          localStorage.setItem('lname', this.lname);
          localStorage.setItem('blocked', JSON.stringify(this.blocked));
          localStorage.setItem('password', this.password);
          localStorage.setItem('picture', this.picture);
          this.navCtrl.push(InterestsPage, {
            password: this.password
          });
        }
        else if(res["_body"]==="Username Already Used"){
          this.alreadyAlert(); //make bad login
        }
      });
    }
    }
    else {
      this.nonameAlert();
    }
  }

  /**
  * Alerts the user if there were empty fields
  */
 nonameAlert() {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'Please fill all fields',
      buttons: ['OK']
    });
    alert.present();
  }

  /**
  * Alerts the user if their username is taken
  */
  alreadyAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'There is already an account with this username',
      buttons: ['OK']
    });
    alert.present();
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
     // imageData is a base64 encoded string
       this.picture = "data:image/jpeg;base64," + imageData;
       localStorage.setItem('picture', this.picture);
   }, (err) => {
       console.log(err);
   });
 }

}
