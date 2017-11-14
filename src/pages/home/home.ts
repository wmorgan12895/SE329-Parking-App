import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as data from './ParkingData.json';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

 data: {};
 lots: any[];

  constructor(public navCtrl: NavController) {
    this.lots = (<any>data).lots;
    console.log(this.lots);
  }
} 
