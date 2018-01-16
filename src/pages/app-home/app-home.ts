import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage({
  name: 'Home',
  segment: 'home'
})
@Component({
  selector: 'page-app-home',
  templateUrl: 'app-home.html',
})
export class AppHomePage {
  constructor(public firebase: FirebaseProvider) {}

  ionViewWillEnter() {
    this.firebase.doAuthCheck();
  }
}
