import { Component, ViewChild, ElementRef} from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-viewlot',
  templateUrl: 'viewlot.html'
})
export class ViewLotPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lot: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,) {
    this.lot = navParams.get('lot');
    this.loadMap();
  }


  loadMap(){

    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkerHere();
      this.addMarkerLot(this.lot);
    }, (err) => {
      console.log(err);
    });
 
  }

  addMarkerHere(){
    
     let marker = new google.maps.Marker({
       map: this.map,
       animation: google.maps.Animation.DROP,
       position: this.map.getCenter()
     });
    
     let content = "<h4>You are here</h4>";         
    
     this.addInfoWindow(marker, content);
    
   }

   addMarkerLot(lot){
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(lot.lat, lot.lon)
        }); 
      
        let content = "<h4>Lot Name: "+lot.LotName+"</h4></br><p>" + lot.ParkingTimes + "</p>";         
        this.addInfoWindow(marker, content);
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
