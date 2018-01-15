import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { ItemCollection } from '../../models/Collection';
import { Attr } from '../../models/CollectionTypes';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Options</ion-list-header>
      <button ion-item (click)="editName()">Change Name</button>
      <button ion-item (click)="editTypes()">Change Mixins</button>
      <button ion-item color="danger" (click)="removeCollection()">Remove Collection</button>
    </ion-list>
  `
})
export class ModifyCollectionPopover implements OnInit {

  public collection: ItemCollection;
  public columns: Attr[] = [];

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private firebase: FirebaseProvider
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
    this.columns = this.navParams.get('columns');
  }

  editName() {
    this.dismiss();

    this.alertCtrl.create({
      title: 'Rename Collection',
      subTitle: 'Change this collection\'s name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Collection Name',
          value: this.collection.name
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Create',
          handler: ({ name }) => {
            name = name.trim();
            if(!name) return;
            this.collection.name = name;
            this.firebase.updateCollection(this.collection);
          }
        }
      ]
    }).present();
  }

  editTypes() {
    this.dismiss({ editTypes: true });
  }

  removeCollection() {
    this.alertCtrl.create({
      title: 'Remove Collection',
      subTitle: 'Are you sure you want to remove this collection and all of it\'s items? This action is irreversible.',
      buttons: [
        'No, keep it',
        {
          text: 'Yes, remove it',
          handler: () => {

            const loading = this.loadingCtrl.create({
              content: 'Removing your items... Please do not refresh the page!'
            });

            loading.present();

            this.firebase.removeCollection(this.collection)
              .then(() => {
                loading.dismiss();
                this.dismiss({ popNav: true });
              });
          }
        }
      ]
    }).present();
  }

  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }
}
