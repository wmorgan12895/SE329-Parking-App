import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MatchesPage } from '../matches/matches';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { StatsPage } from '../stats/stats';
import { Messaging } from '../../providers/messaging';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MatchesPage;
  tab2Root: any = ProfilePage;
  tab3Root: any = SettingsPage;
  tab4Root: any = StatsPage;
  user: any;

  //constructs the tab page with navParams sent from login page
  constructor(navParams: NavParams, private messaging: Messaging) {
    this.user = localStorage.getItem('fname');
    messaging.login();
  }
}
