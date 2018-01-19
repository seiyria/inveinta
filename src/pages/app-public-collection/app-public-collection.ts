import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Item, ItemCollection } from '../../models/Collection';
import { CollectionTypesHash, CollectionAttr } from '../../models/CollectionTypes';

import * as _ from 'lodash';
import { Profile } from '../../models/Profile';

@IonicPage({
  name: 'AppPublicCollection',
  segment: 'p/:uuid'
})
@Component({
  selector: 'page-app-public-collection',
  templateUrl: 'app-public-collection.html',
})
export class AppPublicCollectionPage {

  private collectionUUID: string;

  private coll$: Subscription;
  private items$: Subscription;
  private profile$: Subscription;

  public privacyError = false;

  public collection: ItemCollection;
  public columns: CollectionAttr[] = [];
  public allItems: Item[] = [];

  constructor(
    public navParams: NavParams,
    private firebase: FirebaseProvider
  ) {}

  async ngOnInit() {

    this.collectionUUID = this.navParams.get('uuid');

    try {
      await this.firebase.loadCollectionItems(this.collectionUUID);
    } catch(e) {
      this.privacyError = true;
      return;
    }

    this.coll$ = this.firebase.currentCollection.subscribe(coll => {

      if(!coll || !coll.isPublic) {
        this.privacyError = true;
        return;
      }

      this.privacyError = false;

      this.collection = coll;

      if(this.profile$) this.profile$.unsubscribe();

      this.profile$ = this.firebase.getUserObservable(coll.owner).subscribe(profile => {

        if(this.items$) this.items$.unsubscribe();

        this.items$ = this.firebase.currentCollectionItems.subscribe(data => {
          this.allItems = data;
          this.updateCollectionTypeColumns(coll, profile);
        });

      });

    });
  }

  ngOnDestroy() {
    if(this.coll$) this.coll$.unsubscribe();
    if(this.items$) this.items$.unsubscribe();
    if(this.profile$) this.profile$.unsubscribe();
  }

  private updateCollectionTypeColumns(coll: ItemCollection, profile: Profile) {
    this.columns = [];

    Object.keys(coll.types).forEach(type => {
      let collTypeRef = CollectionTypesHash[type];
      if(!collTypeRef) {
        collTypeRef = _.find(_.values(profile.mixins), { id: type });

        // if we don't have a custom mixin of this type and it's not in the hash, remove and save
        if(!collTypeRef) {
          delete coll.types[type];
          this.firebase.updateCollection(coll);
          return;
        }
      }

      this.columns.push(...collTypeRef.props);
    });

    this.columns = _(this.columns)
      .uniqBy('prop')
      .sortBy('compute')
      .reverse()
      .value();

    this.columns.unshift({ name: 'Name', prop: 'name', type: 'string' });
  }

}
