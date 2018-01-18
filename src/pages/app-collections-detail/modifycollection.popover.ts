import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { ItemCollection } from '../../models/Collection';
import { CollectionAttr } from '../../models/CollectionTypes';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ShareCollectionModal } from './sharing.modal';

import * as Clipboard from 'clipboard';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NotifierProvider } from '../../providers/notifier/notifier';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <button ion-item (click)="editName()">Change Name</button>
      <button ion-item (click)="editTypes()">Change Mixins</button>
      <button ion-item (click)="openShare()">Share Collection</button>
      <ion-item>
        <ion-label>Public</ion-label>
        <ion-toggle [(ngModel)]="collection.isPublic" (ionChange)="togglePublic()"></ion-toggle>
      </ion-item>
      <button ion-item color="secondary" 
              *ngIf="collection.isPublic" 
              [attr.data-clipboard-text]="publicURL"
              class="copy-button">Get Public URL</button>
      <button ion-item color="danger" (click)="removeCollection()">Remove Collection</button>
    </ion-list>
  `
})
export class ModifyCollectionPopover implements OnInit, OnDestroy {

  public collection: ItemCollection;
  public columns: CollectionAttr[] = [];

  private clipboard: Clipboard;

  public get publicURL(): string {
    return `${window.location.origin}/#/p/${this.collection.id}`;
  }

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private firebase: FirebaseProvider,
    private notifier: NotifierProvider
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
    this.columns = this.navParams.get('columns');

    this.clipboard = new Clipboard('.copy-button');

    this.clipboard.on('success', () => {
      this.notifier.toast('Copied public URL to clipboard!');
    });
  }

  ngOnDestroy() {
    if(this.clipboard) this.clipboard.destroy();
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
  
  togglePublic() {
    this.firebase.updateCollection(this.collection);
  }

  editTypes() {
    this.dismiss({ editTypes: true });
  }

  openShare() {
    const modal = this.modalCtrl.create(ShareCollectionModal, {
      collection: this.collection
    });
    modal.present();
    this.dismiss();
  }

  removeCollection() {
    this.alertCtrl.create({
      title: 'Remove Collection',
      subTitle: 'Are you sure you want to remove this collection and all of it\'s items? This action is irreversible.',
      buttons: [
        {
          text: 'No, keep it',
          handler: () => {
            this.dismiss();
          }
        },
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
