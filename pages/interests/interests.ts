import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http } from '@angular/http';

const SERVER_URL = "https://ice-server.herokuapp.com/";

@Component({
  selector: 'page-interests',
  templateUrl: 'interests.html'
})

/**
 * Class that handles the interaction for the add interests page
 */
export class InterestsPage {
  interests: any[];
  categories: string[];
  newInterest: string;
  newCat: string;
  username: string;
  fname: string;
  lname: string;
  password: string;
  picture: string;

  /**
   * constucts the page
   * @param navCtrl - controls the navigation between pages
   * @param alertCtrl - displays alerts
   * @param params - allows parameters to be passed between pages
   * @param http - allows http requests to be sent to the server
   */
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private http:Http) {
    this.interests = [];
    //set username equal to local storage username
    this.username = localStorage.getItem('username');
    this.fname = localStorage.getItem('fname');
    this.lname = localStorage.getItem('lname');
    this.password = navParams.get('password');
    this.picture = localStorage.getItem('picture');
    this.categories = [
      'Books',
      'Music',
      'Sports',
      'Movies',
      'TV',
      'Activities'
    ];
  }

  /**
   * adds the interest to the current user's set of interests
   */
  addInterest(event) {
    if(this.newCat && this.newInterest !== "") {
      this.newCat = this.newCat.replace(/\s/g,'');
      this.interests.push({interest: this.newInterest, category: this.newCat});
      this.sortInterests();
      this.newCat = "";
      this.newInterest = "";
    }
    else{
      this.interestAlert();
    }
  }

  delete(index) {
    this.interests.splice(index, 1);
  }

  /**
   * checks to see if the user has at least 5 interests. If not, the user is alerted.
   * Otherwise the user's data is stored and they are routed to the tabs page
   */
  continue(event) {
    if(this.newCat && this.newInterest !== "") {
      this.newCat = this.newCat.replace(/\s/g,'');
      this.interests.push({interest: this.newInterest, category: this.newCat});
      this.sortInterests();
      this.newCat = "";
      this.newInterest = "";
    }
    if (this.interests.length >= 5) {
      //post request for initial interests
      let body = JSON.stringify({
        username: this.username,
        password: this.password,
        fname: this.fname,
        lname: this.lname,
        interests: this.interests,
        picture: this.picture
      });
      this.http.post(SERVER_URL + "createAccount", body)
      .subscribe(res => {
        if(res["_body"]==="Saved Account"){
          //set local storage
          let interestString = JSON.stringify({
            interests: this.interests
          });
          localStorage.setItem('interests', interestString);
          localStorage.setItem('todaysMatches', "[]");
          this.navCtrl.push(TabsPage, {
          });
        }
        else{
          this.alreadyAlert();
        }
      });
    }
    else {
      this.numInterestAlert();
    }
  }

  sortInterests() {
    this.interests.sort((a, b): number => {
      if(a.category == b.category) {
        return a.interest.localeCompare(b.interest);
      }
      return a.category.localeCompare(b.category);
    })
  }

  /**
   * alerts the user if they do not have at least 5 interests
   */
  numInterestAlert() {
    let alert = this.alertCtrl.create({
      title: 'Empty Interests',
      subTitle: 'Please enter five interests and their categories',
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * alerts the uesr if they are trying to add a blank interest or an interest with no category
   */
  interestAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Interest',
      subTitle: 'Please enter an interest and select a category',
      buttons: ['OK']
    });
    alert.present();
  }

  alreadyAlert() {
    let alert = this.alertCtrl.create({
      subTitle: 'There is already an account with this username',
      buttons: ['OK']
    });
    alert.present();
  }
}
