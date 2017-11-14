import { Component, ViewChild, ElementRef} from '@angular/core';

import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MatchProfilePage } from '../match-profile/match-profile';

declare var google;

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  matches: any[];
  mostMatched: any;
  constructor(public navCtrl: NavController) {
    this.matches = JSON.parse(localStorage.getItem('todaysMatches'));
    this.getMostMatched();
    this.loadMap();
  }

  getMostMatched() {
    let map = new Map();
    for(let i = 0; i < this.matches.length; i++) {
      let matchedOn = this.matches[i].commonInterests;
      for(let j = 0; j < matchedOn.length; j++) {
        map.add(matchedOn[j]);
      }
    }
    this.mostMatched = map.getMax();

  }

  loadMap(){

    this.matches = JSON.parse(localStorage.getItem('todaysMatches'));
    this.getMostMatched();
    console.log(this.matches);
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkers();
 
    }, (err) => {
      console.log(err);
    });
 
  }

  addMarkers(){
 
    for (let i = 0; i < this.matches.length; i++)
    {
      let lat = this.disperse(this.matches[i].location.lat);
      let long = this.disperse(this.matches[i].location.long);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(lat, long)
      });         
      this.addInfoWindow(marker, this.matches[i]);
    }
 
  }

  /**
   * function that disperses the locations of matches that you got all in one place by adding a random number between -.0005 and .0005
   */
  disperse(dist) {
    let ret = dist + (Math.random() - .5) * .0001;
    return ret;
  }

  addInfoWindow(marker, match){
  
    google.maps.event.addListener(marker, 'click', () => {
      this.seeMatch(match);
    });
 
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
}

class Map {
  keys: string[];
  values: number[];
  constructor() {
    this.keys = [];
    this.values = [];
  }
  add(s) {
    let index = this.keys.indexOf(s)
    if(index >= 0) {
      this.values[index]++;
    }
    else {
      this.keys.push(s);
      this.values.push(1);
    }
  }
  getMax(): {interest: string, val: number} {
    let max = 0;
    let index = -1;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] > max) {
        max = this.values[i];
        index = i;
      }
    }
    if (index >= 0) {
      return {interest: this.keys[index], val: max};
    }
    else {
      return {interest: "", val: max};
    }
  }
}