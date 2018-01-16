import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavParams, ViewController } from 'ionic-angular';
import { ItemCollection } from '../../models/Collection';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { NotifierProvider } from '../../providers/notifier/notifier';

@Component({
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-buttons start>
          <button color="light" ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>Share This Collection</ion-title>
      </ion-navbar>

    </ion-header>


    <ion-content padding>
      <ion-list>
        <ion-item>
          <ion-label stacked>Invite User By Share ID</ion-label>
          <ion-input [(ngModel)]="shareID" placeholder="Other User's Share ID"></ion-input>
          <button ion-button color="primary" (click)="share()" item-end>Invite</button>
        </ion-item>
        
        <ion-item *ngFor="let id of sharedWithIds">
          <h2 *ngIf="getUserObservable(id) | async as user">{{ user.name }}</h2>
          <p>{{ id }}</p>
          <button ion-button color="danger" (click)="unshare(id)" item-end *ngIf="id !== collection.owner && id !== firebase.uid">Revoke</button>
        </ion-item>
      </ion-list>

    </ion-content>
    
    <ion-footer>
      <ion-toolbar>
        <ion-buttons end>
          <button ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class ShareCollectionModal implements OnInit {

  public shareID: string;
  public collection: ItemCollection;

  private userObservables = {};

  public get sharedWithIds(): string[] {
    return Object.keys(this.collection.sharedWith);
  }

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public firebase: FirebaseProvider,
    private notifier: NotifierProvider
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
  }

  public getUserObservable(id: string) {
    if(this.userObservables[id]) return this.userObservables[id];
    this.userObservables[id] = this.firebase.getUserObservable(id);
    return this.userObservables[id];
  }

  async share() {
    const id = this.shareID;
    this.shareID = '';

    if(this.collection.sharedWith[id]) {
      this.notifier.toast('This collection is already shared with that person!');
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Searching for user...'
    });

    loading.present();

    try {
      await this.firebase.getUserById(id);
      loading.dismiss();
    } catch(e) {
      this.notifier.toast('This person does not exist!');
      loading.dismiss();
      return;
    }

    this.collection.sharedWith[id] = true;
    this.firebase.updateCollection(this.collection);
    this.notifier.toast('Successfully shared!');
  }

  unshare(id: string) {
    this.alertCtrl.create({
      title: 'Unshare Collection',
      subTitle: 'Are you sure you want to unshare this collection with this user?',
      buttons: [
        'No, Keep Shared',
        {
          text: 'Yes, Unshare',
          handler: () => {
            delete this.collection.sharedWith[id];
            this.firebase.updateCollection(this.collection);
            this.notifier.toast('Successfully unshared!');
          }
        }
      ]
    }).present();
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
