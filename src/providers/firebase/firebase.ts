import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Profile } from '../../models/Profile';
import { Item, ItemCollection } from '../../models/Collection';

import { Events } from 'ionic-angular';
import { CollectionType } from '../../models/CollectionTypes';

@Injectable()
export class FirebaseProvider {

  private auth$: Subscription;
  private authData: any = {};

  private profileDoc;
  private profile;
  private profileSubscription: Subscription;

  private allCollectionsCol;
  private allCollectionsLive;

  private curCollectionDoc;
  private curCollectionLive;

  private curItemsCol;
  private curItemsLive;

  public currentProfile: Profile;

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
    if(!this.authData) return '';
    return this.authData.uid;
  }

  public get isAuthenticated(): boolean {
    return !!this.uid;
  }

  public get myCollections(): Observable<ItemCollection[]> {
    return this.allCollectionsLive;
  }

  public get currentCollection() {
    return this.curCollectionLive;
  }

  public get currentCollectionItems(): Observable<Item[]> {
    return this.curItemsLive;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private events: Events
  ) {
    this.init();
  }

  public doAuthCheck() {
    if(this.isAuthenticated) return;
    this.forceGoHome();
  }

  public forceGoHome() {
    this.events.publish('you-cant-be-here');
  }

  private init() {
    this.auth$ = this.authState.subscribe(d => {
      if(!d) {
        if(this.profileSubscription) this.profileSubscription.unsubscribe();
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
      if(d) {
        this.currentProfile = d;
        return;
      }
      this.initProfile();
    });

    this.allCollectionsCol = this.afStore.collection<ItemCollection>('collections');
    this.allCollectionsLive = this.afStore.collection<ItemCollection>('collections', ref => {
      return ref.where(`sharedWith.${this.uid}`, '==', true);
    }).valueChanges();
  }

  public async createNewCollection(name: string, types: { [key: string]: boolean }) {
    const collection: ItemCollection = {
      name,
      id: this.afStore.createId(),
      createdAt: Date.now(),
      types,
      owner: this.uid,
      itemCount: 0,
      sharedWith: {
        [this.uid]: true
      }
    };

    this.profileDoc.update({ [`collections.${collection.id}`]: true });
    this.allCollectionsCol.doc(collection.id).set(collection);
  }

  private async initProfile(): Promise<any> {
    return this.profileDoc.set({
      name: this.name,
      mixins: {},
      collections: {}
    });
  }

  public async loadCollectionItems(uuid: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.curItemsCol = this.afStore.collection<Item>('items');
      this.curItemsLive = this.afStore.collection<Item>('items', ref => {
        return ref.where('collectionFBID', '==', uuid);
      }).valueChanges();

      this.curCollectionDoc = this.afStore.doc<ItemCollection>(`collections/${uuid}`);
      this.curCollectionLive = this.curCollectionDoc.valueChanges();

      // can't use curCollectionLive because it removes the possibility to resubscribe
      const doesExist = this.curCollectionDoc.valueChanges().subscribe(data => {
        doesExist.unsubscribe();

        if(!data) {
          reject(new Error('Collection does not exist'));
          return;
        }

        resolve(data);
      });
    });

  }

  public updateCollection(coll: ItemCollection): Promise<any> {
    return this.curCollectionDoc.update(coll);
  }

  private async deleteCollection(db, collectionRef, batchSize) {
    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  }

  private deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
      .then((snapshot) => {

        if(snapshot.size === 0) {
          return 0;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
          return snapshot.size;
        });

      })

      .then((numDeleted) => {
        if(numDeleted < batchSize) {
          resolve();
          return;
        }

        this.deleteQueryBatch(db, query, batchSize, resolve, reject);
      })

      .catch(reject);
  }

  public async removeCollection(coll: ItemCollection): Promise<any> {
    await this.deleteCollection(this.afStore.firestore, this.curItemsCol.query, 50);
    await this.curCollectionDoc.delete();
  }

  public addCollectionItem(item: Item) {
    if(!item.collectionFBID) return;
    item.id = this.afStore.createId();
    this.curItemsCol.doc(item.id).set(item);
  }

  public updateCollectionItem(item: Item) {
    this.curItemsCol.doc(item.id).update(item);
  }

  public removeCollectionItem(item: Item) {
    this.curItemsCol.doc(item.id).delete();
  }

  public getUserObservable(id: string): Observable<Profile> {
    return this.afStore.doc<Profile>(`users/${id}`).valueChanges();
  }

  public getUserById(id: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      const sub = this.getUserObservable(id).subscribe(data => {
        if(!data) return reject(new Error(`User with id ${id} does not exist`));

        resolve(data);
        sub.unsubscribe();
      });
    });
  }

  public updateCustomMixin(mixin: CollectionType) {
    this.currentProfile.mixins = this.currentProfile.mixins || {};
    this.currentProfile.mixins[mixin.id] = mixin;

    this.profileDoc.update({ mixins: this.currentProfile.mixins });
  }

  public removeCustomMixin(mixin: CollectionType) {
    this.currentProfile.mixins = this.currentProfile.mixins || {};
    delete this.currentProfile.mixins[mixin.id];

    this.profileDoc.update({ mixins: this.currentProfile.mixins });
  }

}
