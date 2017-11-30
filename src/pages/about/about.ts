import { Component, ViewChild, ElementRef} from '@angular/core';

import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import * as data from '../ParkingData.json';

declare var google;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {
    this.loadMap();
  }


  loadMap(){

    Geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkerHere();
      this.addMarkerLots((<any>data).lots);
    }, (err) => {
      console.log(err);
    });
 
  }

  addMarkerHere(){
    
     let marker = new google.maps.Marker({
       map: this.map,
       animation: google.maps.Animation.DROP,
       icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
       position: this.map.getCenter()
     });
    
     let content = "<h4>You are here</h4>";         
    
     this.addInfoWindow(marker, content);
    
   }

   addMarkerLots(lots){
    lots.forEach(element => {
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(element.lat, element.lon)
        }); 
      
        let content = "<h4>Lot Name: "+element.LotName+"</h4></br><p>Unavailable Hours: " + this.displayHours(element) + "</p>";         
        console.log(content);
        this.addInfoWindow(marker, content);
    });
   }

   addInfoWindow(marker, content){
    
     let infoWindow = new google.maps.InfoWindow({
       content: content
     });
    
     google.maps.event.addListener(marker, 'click', () => {
       infoWindow.open(this.map, marker);
     });
    
   }

   displayHours(lot){
    if(lot.UnavailableStart == "X"){
      return "All Hours All Days";
    }
    return "M-F: "+ lot.UnavailableStart + "-" + lot.UnavailableStop
  }

}
