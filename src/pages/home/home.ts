import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import * as data from './ParkingData.json';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

 data: any[];
 lots: any[];
 lat: number;
 long: number;


  classes: any = {
    'red': false,
    'green': true
  };


  constructor(public navCtrl: NavController) {
    var dataLots = (<any>data).lots
    this.lots = [];
    this.orderLots(dataLots);
  }


  orderLots(lots){
    Geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      lots.forEach(element => {
        console.log(element.LotName);
        var distance = this.distance(this.lat, this.long, element.lat, element.lon,"F");
        var isOpen =  this.isOpen(element);
        var ParkingTimes = this.displayHours(element);
        var lot = {
          LotName: element.LotName,
          ParkingTimes: ParkingTimes,
          distance: distance,
          isOpen: isOpen
        }
        this.insertLot(lot);
      }); 
      console.log(this.lots);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  insertLot(lot){
    if (this.lots.length == 0 ){
      this.lots.push(lot);
    } else {
      for(var i = 0; i<this.lots.length; i++){
        if(this.lots[i].distance > lot.distance){
          this.lots.splice(i, 0, lot)
          break;
        } 
      }
      if(i == this.lots.length){
        this.lots.push(lot);
      }
    }
  }

 distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }

  displayHours(lot){
    if(lot.UnavailableStart == "X"){
      return "All Hours All Days";
    }
    return ""+ lot.UnavailableStart + "-" + lot.UnavailableStop
  }

  isOpen(lot){
    if(lot.UnavailableStart == "X"){
      return false;
    }
    var d = new Date(); // current time
    var hours = d.getHours();
    var mins = d.getMinutes();
    var day = d.getDay();

    if(day == 6 || day == 0){
      return true;
    }

    var start = new Date (new Date().toDateString() + ' ' + lot.UnavailableStart)
    var stop = new Date (new Date().toDateString() + ' ' + lot.UnavailableStop)

    if(hours < start.getHours()){
      return true;
    } else if (hours == start.getHours() && mins < start.getMinutes()){
      return true;
    }

    if(hours > stop.getHours()){
      return true;
    } else if (hours == stop.getHours() && mins > start.getMinutes()){
      return true;
    }

    return false

  }

}



