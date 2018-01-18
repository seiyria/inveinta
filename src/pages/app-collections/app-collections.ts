import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, ToastController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ItemCollection } from '../../models/Collection';
import { CollectionTypesHash } from '../../models/CollectionTypes';

import * as Clipboard from 'clipboard';

import * as _ from 'lodash';
import { NotifierProvider } from '../../providers/notifier/notifier';

@IonicPage({
  name: 'Collections',
  segment: 'collections'
})
@Component({
  selector: 'page-app-collections',
  templateUrl: 'app-collections.html',
})
export class AppCollectionsPage {

  private clipboard: Clipboard;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public firebase: FirebaseProvider,
    private notifier: NotifierProvider
  ) {}

  ionViewWillEnter() {
    this.firebase.doAuthCheck();
  }

  ngOnInit() {
    this.clipboard = new Clipboard('.copy-button');

    this.clipboard.on('success', () => {
      this.notifier.toast('Copied Share ID to clipboard!');
    });
  }

  ngOnDestroy() {
    if(this.clipboard) this.clipboard.destroy();
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
      .map(id => {
        if(CollectionTypesHash[id]) return CollectionTypesHash[id].name;
        const myMixin = _.find(this.firebase.currentProfile.mixins, { id });
        if(myMixin) return myMixin.name;
        return null;
      })
    );
  }

  public loadCollection(uuid: string) {
    this.navCtrl.push('CollectionsDetail', {
      uuid
    });
  }
}
