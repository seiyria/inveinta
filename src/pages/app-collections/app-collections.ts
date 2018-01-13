import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'Collections',
  segment: 'collections'
})
@Component({
  selector: 'page-app-collections',
  templateUrl: 'app-collections.html',
})
export class AppCollectionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppCollectionsPage');
  }

}
