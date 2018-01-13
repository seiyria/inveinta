import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'Home',
  segment: 'home'
})
@Component({
  selector: 'page-app-home',
  templateUrl: 'app-home.html',
})
export class AppHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppHomePage');
  }

}
