import { Component } from '@angular/core';
import { AlertController, IonicPage } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage({
  name: 'Collections',
  segment: 'collections'
})
@Component({
  selector: 'page-app-collections',
  templateUrl: 'app-collections.html',
})
export class AppCollectionsPage {

  constructor(
    private alertCtrl: AlertController,
    public firebase: FirebaseProvider
  ) {}

  public createCollection() {
    this.alertCtrl.create({
      title: 'Create Collection',
      subTitle: 'Give this collection a name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Collection Name'
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Create',
          handler: ({ name }) => {
            name = name.trim();
            if(!name) return;
            this.firebase.createNewCollection(name, {});
          }
        }
      ]
    }).present();
  }
}
