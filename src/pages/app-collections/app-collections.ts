import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ItemCollection } from '../../models/Collection';
import { CollectionTypesHash } from '../../models/CollectionTypes';

import * as _ from 'lodash';

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
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public firebase: FirebaseProvider
  ) {}

  ionViewWillEnter() {
    this.firebase.doAuthCheck();
  }

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

            const loading = this.loadingCtrl.create({
              content: 'Creating your new collection...'
            });

            loading.present();

            this.firebase.createNewCollection(name, {})
              .then(() => {
                loading.dismiss();
              });
          }
        }
      ]
    }).present();
  }

  public collectionTypes(coll: ItemCollection): string[] {

    return _.compact(Object.keys(coll.types)
      .map(id => CollectionTypesHash[id] ? CollectionTypesHash[id].name : null)
    );
  }

  public loadCollection(uuid: string) {
    this.navCtrl.push('CollectionsDetail', {
      uuid
    });
  }
}
