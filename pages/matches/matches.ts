import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';
import { MatchProfilePage } from '../match-profile/match-profile';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html'
})
export class MatchesPage {

  username: string;
  lat: number;
  long: number;
  alt: number;
  fname: string;
  //profilePicture: string;
  message: string;
  locals: any[];
  matches: any[];
  myInterests: any[];
  lastStorageDate: any;
  todaysMatches: any[];
  priorityInterest: any;
  priorityInterestDate: any;
  gotMatches: boolean;

  constructor(public navCtrl: NavController,
              private http: Http,
              public alertCtrl: AlertController) {
    this.http = http;
    this.fname = localStorage.getItem('fname');
    this.username = localStorage.getItem('username');
    this.myInterests = JSON.parse(localStorage.getItem('interests')).interests;
    this.todaysMatches = JSON.parse(localStorage.getItem('todaysMatches'));
    this.priorityInterestDate = JSON.parse(localStorage.getItem('priorityInterestDate'));
    this.getInterest();
    this.getMatches(null);
  }

  /**
   * getPosition
   * gets latitude, longitude, and altitude from native
   */
  getPosition() {
    Geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.alt = resp.coords.altitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  refreshMatches(refresher){
    this.gotMatches = false;
    this.getMatches(refresher);
    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   refresher.complete();
    // }, 2000);
  }

  /**
   * getMatches
   * Gets local users from server and calls findMatches()
   */
  getMatches(refresher) {
    //Refresh position to prepare for matches
    this.getPosition();

    //Clear matches to remove any matches that are no longer in area
    this.matches = [];
    this.locals = [];

    //Set up object to send server
    let body = JSON.stringify({
      username: this.username,
      lat: this.lat,
      long: this.long,
      alt: this.alt
    });

    //Send server data, recieve and parse data into matchList
    this.http.post("https://ice-server.herokuapp.com/pingLocation",body).subscribe(res => {
      //Extract recieved matches JSON to local array
      this.locals = JSON.parse(res["_body"]).matches;
      //@TEMP Log all local members
      console.log(this.locals);
      //Call function to find actual matches - TESTING
      this.findMatches(refresher);
    }, error => {
      console.log("Oooops!");
    });
  }


  /**
   * findMatches
   * compares local users instrests with users and places matches into array
   */
  findMatches(refresher) {
    //Get date
    let todaysDate = {
      date: new Date().getDay(),
      month: new Date().getMonth()
    }
    // Rest boolean variable to check for at least one common interest
    let matched = 0;
    let priorityHit = false;
    let commonInterests = [];
    //Reset matches list
    this.matches = [];
    // For each member in local
    for(var x = 0; x < this.locals.length; x++){
      matched = 0;
      priorityHit = false;
      commonInterests = [];
      console.log("Checking matches with: " + this.locals[x].username);
      if(this.priorityInterest != null){
        if(this.locals[x].priorityInterest.interest != null){
          console.log("Checking priority interest");
          console.log("Their interest: " + this.locals[x].priorityInterest.interest);
          console.log("My interest: " + this.priorityInterest.interest);
          if(this.equals(this.locals[x].priorityInterest.category, this.priorityInterest.category)){
            if(this.equals(this.locals[x].priorityInterest.interest, this.priorityInterest.interest)){
              console.log("Priority interests matched!");
              priorityHit = true;
            }
          }
        }
      }
      if(matched == 0){
        // For each of own interests
        for(var y = 0; y < this.myInterests.length; y++){
          console.log("Checking own interest: " + this.myInterests[y].interest);
          // For each of local member's interests
          for(var z = 0; z < this.locals[x].interests.length; z++){
            // Check category for equality
            if(this.equals(this.locals[x].interests[z].category, this.myInterests[y].category)){
              // Check interest for equality
              if(this.equals(this.locals[x].interests[z].interest, this.myInterests[y].interest)){
                // Push common interest to array
                commonInterests.push(this.locals[x].interests[z].interest);
                matched++;
                console.log("Matched Interest!!!");
              }
            }
          }
        }
      }
      //If at least one interest has been matched
      if(matched || priorityHit){
        //Create match object
        let match = {
          fname: this.locals[x].username,
          profile: this.locals[x],
          distance: this.locals[x].distance,
          priorityInterest: this.locals[x].priorityInterest.interest,
          priorityHit: priorityHit,
          commonInterests: commonInterests,
          location: {lat: this.lat, long: this.long},
          date: {month: todaysDate.month, day: todaysDate.date},
          profilePicture: this.locals[x].profilePicture
        }
        //Push to array
        this.matches.push(match);
      }
    }
    this.matches.sort((a, b): number => {
      if(a.priorityHit == true && b.priorityHit == false){
        return -1;
      }
      else if(a.priorityHit == false && b.priorityHit == true){
        return 1;
      }
      else{
        return b.commonInterests.length - a.commonInterests.length;
      }
    })
    //******** UNCOMMENT FUNCTION BELOW WHEN READY ********
    // Sends updated list of today's matches to server
    this.uploadMatches(this.matches);
    if(refresher != null){
      console.log("Refresher complete!")
      refresher.complete();
    }
  }

  /**
   * uploadMatches
   * Adds new unique matches to today's matches and uploads to server
   * @param matches   array of match objects to save in local storage
   */
  uploadMatches(matches){
    //Today's array already created
    if(this.todaysMatches.length != 0){
      for(var x = 0; x < this.matches.length; x++){
        let contain = false;
        for(var y = 0; y < this.todaysMatches.length; y++){
          if(this.matches[x].profile.username == this.todaysMatches[y].profile.username){
            contain = true;
          }
        }
        if(!contain){
          this.todaysMatches.push(this.matches[x]);
        }
      }
    }
    else{
      this.todaysMatches = this.matches;
    }
    localStorage.setItem('todaysMatches', JSON.stringify(this.todaysMatches));
    let body = {
      username: this.username,
      todaysMatches: this.todaysMatches
    }
    this.http.post("https://ice-server.herokuapp.com/uploadMatches",body).subscribe(res => {
      console.log("todaysMatches updated")
    }, error => {
      console.log("todaysMatches update failed!");
    });
  }

  /**
   * equals
   * Comparator to check for equality of interest names
   * @param string1   first string to compare
   * @param string2   second string to compare
   * @returns         true if string objects are considered equal
   */
  equals(string1, string2){
    // Remove upper cases
    string1 = string1.toLowerCase();
    string2 = string2.toLowerCase();
    // Remove everything except characters
    string1 = string1.replace(/[^a-z0-9]/g, "");
    string2 = string2.replace(/[^a-z0-9]/g, "");
    // Check for equality
    if(string1 === string2){
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * seeMatch
   * Loads page for selected match profile
   * @param match   profile of matched user that was selected
   */
  seeMatch(match){
    this.navCtrl.push(MatchProfilePage, {
      profile: match.profile
    });
  }

  getInterest(){
    //Gets interest from user
    let d = new Date();
    if(this.priorityInterestDate == d.getDate()){
      let oldInterest = JSON.parse(localStorage.getItem('priorityInterest'))
      this.priorityInterest = {
        interest: oldInterest.interest,
        category: oldInterest.category
      }
      return null;
    }
    //let added = false;   hey what is this?
    //let exit = false;                       same q
    let prompt = this.alertCtrl.create({
      title: 'Hey!',
      message: "What do you want to talk about today?  Add a new interest here...",
      inputs: [
        {
          name: 'interest',
          placeholder: 'Interest'
        },
      ],
      buttons: [
        {
          text: 'Not now',
          handler: data => {
            console.log('Cancel clicked');
            return null;
          }
        },
        {
          text: 'Add',
          handler: data => {
            if(data.interest === ''){
              this.errorAlert(1);
              return null;
            }
            else{
              this.getCategory(data.interest);
              return null;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  getCategory(interest){
    if(interest != null){
      this.priorityInterest = {
        interest: interest,
        category: null
      }
    }

    //Gets the category from user
    let alert = this.alertCtrl.create();
    alert.setTitle('What is the category?');

    alert.addInput({
      type: 'radio',
      label: 'Books',
      value: 'books',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Music',
      value: 'music',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Sports',
      value: 'sports',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Movies',
      value: 'movies',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'TV',
      value: 'tv',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Activities',
      value: 'activities',
      checked: false
    });

    alert.addButton({
      text: 'Cancel',
      handler: data => {
        return null;
      }
    });
    alert.addButton({
      text: 'Add',
      handler: data => {
        if(data == null){
          this.errorAlert(2);
          return null;
        }

        this.priorityInterest.category = data;

        let body = {
          username: this.username,
          priorityInterest: {
            interest: this.priorityInterest.interest,
            category: this.priorityInterest.category
          }
        }

        console.log("Priority Interest: " + this.priorityInterest.interest + " with category: " + this.priorityInterest.category)

        this.http.post("https://ice-server.herokuapp.com/setPriorityInterest",body).subscribe(res => {
          console.log("priority interest message sent!");
          let d = new Date()
          this.priorityInterestDate = d.getDate();
          localStorage.setItem('priorityInterestDate', JSON.stringify(this.priorityInterestDate));
        }, error => {
          console.log("priority interest message failded!");
        });
        //Do something if okay is pressed
        localStorage.setItem('priorityInterest', JSON.stringify(this.priorityInterest));
      }
    });
    alert.present();
  }

  errorAlert(error){
    //Sends errors to user for adding an interest
    let confirm;
    if(error === 1){
      confirm = this.alertCtrl.create({
        title: 'No interest added',
        message: 'Do you still want to add an interest?',
        buttons: [
          {
          text: 'No',
            handler: () => {
              console.log('Disagree clicked');
              return null;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Agree clicked');
              this.getInterest();
            }
          }
        ]
      });
    }
    else if(error === 2){
      confirm = this.alertCtrl.create({
        title: 'No category selected',
        message: 'Do you still want to continue?',
        buttons: [
          {
          text: 'No',
            handler: () => {
              console.log('Disagree clicked');
              return null;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Agree clicked');
              this.getCategory(null);
            }
          }
        ]
      });
    }
    confirm.present();
  }
}
