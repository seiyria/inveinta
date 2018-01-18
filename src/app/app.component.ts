import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { FirebaseProvider } from '../providers/firebase/firebase';

import * as _ from 'lodash';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public activePage: string;
  public isOnPublicPage: boolean;
  rootPage: any = HomePage;

  pages: Array<{title: string, component: string, badge?: () => number }> = [
    { title: 'Collections', component: 'Collections' }
  ];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private alertCtrl: AlertController,
    private events: Events,
    public firebase: FirebaseProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.nav.viewWillEnter.subscribe((view) => {
        if(_.startsWith(view.id, 'collections/')) this.activePage = 'Collections';
        this.isOnPublicPage = _.startsWith(view.id, 'p/');
      });
    });

    this.events.subscribe('you-cant-be-here', () => {
      this.nav.setRoot(HomePage);
    });
  }

  async openPage(page) {
    if(this.activePage === page.component) return;

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    try {
      await this.nav.setRoot(page.component);
    } catch(e) {
      this.nav.setRoot(HomePage);
    }
  }

  logout() {
    this.alertCtrl.create({
      title: 'Log out',
      subTitle: 'Are you sure you want to log out?',
      buttons: [
        'No, stay logged in',
        {
          text: 'Yes, log out',
          handler: () => {
            this.firebase.auth.signOut();
            this.nav.setRoot(HomePage);
          }
        }
      ]
    }).present();
  }
}
