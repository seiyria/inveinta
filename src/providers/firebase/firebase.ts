import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Profile } from '../../models/Profile';
import { ItemCollection } from '../../models/Collection';

import * as uuid from 'uuid/v4';

@Injectable()
export class FirebaseProvider {

  private auth$: Subscription;
  private authData: any = {};

  private profileDoc;
  private profile;
  private profileSubscription: Subscription;

  private allCollectionsCol;
  private allCollectionsLive;

  public get authState(): Observable<any> {
    return this.afAuth.authState;
  }

  public get auth() {
    return this.afAuth.auth;
  }

  public get name(): string {
    if(!this.authData) return '';
    return this.authData.displayName || this.authData.email;
  }

  public get uid(): string {
    return this.authData.uid;
  }

  public get myProfile() {
    return this.profile;
  }

  public get myCollections() {
    return this.allCollectionsLive;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore
  ) {
    this.init();
  }

  private init() {
    this.auth$ = this.authState.subscribe(d => {
      if(!d) {
        this.profileSubscription.unsubscribe();
        this.authData = null;
        return;
      }

      this.authData = d;
      this.initCollections();
    });
  }

  private initCollections() {
    this.profileDoc = this.afStore.doc<Profile>(`users/${this.uid}`);
    this.profile = this.profileDoc.valueChanges();

    this.profileSubscription = this.profile.subscribe(d => {
      if(d) return;
      this.initProfile();
    });

    this.allCollectionsCol = this.afStore.collection<ItemCollection>('collections');
    this.allCollectionsLive = this.afStore.collection<ItemCollection>('collections', ref => {
      return ref.where(`sharedWith.${this.uid}`, '==', true);
    }).valueChanges();
  }

  public async createNewCollection(name: string, types: { [key: string]: string }) {
    const collection: ItemCollection = {
      name,
      createdAt: Date.now(),
      uuid: uuid(),
      types,
      owner: this.uid,
      itemCount: 0,
      sharedWith: {
        [this.uid]: true
      }
    };

    this.profileDoc.update({ [`collections.${collection.uuid}`]: true });
    this.allCollectionsCol.add(collection);
  }

  private async initProfile(): Promise<any> {
    return this.profileDoc.set({});
  }

}
