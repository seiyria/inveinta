import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams,
  PopoverController
} from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Subscription } from 'rxjs/Subscription';
import { Item, ItemCollection } from '../../models/Collection';
import { AddItemModal } from './additem.modal';
import { CollectionAttr, CollectionType, CollectionTypes, CollectionTypesHash } from '../../models/CollectionTypes';

import * as _ from 'lodash';
import { ModifyCollectionPopover } from './modifycollection.popover';
import { ModifyItemPopover } from './modifyitem.popover';
import { AddMixinModal } from './addmixin.modal';
import { ModifyMixinPopover } from './modifymixin.popover';

@IonicPage({
  name: 'CollectionsDetail',
  segment: 'collections/:uuid',
  defaultHistory: ['Collections']
})
@Component({
  selector: 'page-app-collections-detail',
  templateUrl: 'app-collections-detail.html',
})
export class AppCollectionsDetailPage implements OnInit, OnDestroy {

  private uuid: string;
  private columns: CollectionAttr[] = [];

  private coll$: Subscription;
  private items$: Subscription;

  private allItems: Item[] = [];

  public forceEditTypes: boolean;
  public selectedTypes: any = {};
  public typeSearchQuery = '';

  public get myTypes(): CollectionType[] {
    return _.values(this.firebase.currentProfile.mixins || {});
  }

  public get types(): CollectionType[] {
    return CollectionTypes;
  }

  public get hasSelectedTypes(): boolean {
    return Object.keys(this.selectedTypes).length > 0;
  }

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public firebase: FirebaseProvider
  ) {}

  ionViewWillEnter() {
    this.firebase.doAuthCheck();
  }

  async ngOnInit() {
    this.uuid = this.navParams.get('uuid');

    try {
      await this.firebase.loadCollectionItems(this.uuid);
    } catch(e) {
      this.firebase.forceGoHome();
      return;
    }

    this.coll$ = this.firebase.currentCollection.subscribe(coll => {

      if(!coll || !coll.sharedWith[this.firebase.uid]) {
        this.firebase.forceGoHome();
        return;
      }

      this.updateCollectionTypeColumns(coll);
    });

    this.items$ = this.firebase.currentCollectionItems.subscribe(data => {
      this.allItems = data;
    });

  }

  ngOnDestroy() {
    if(this.coll$) this.coll$.unsubscribe();
    if(this.items$) this.items$.unsubscribe();
  }

  private updateCollectionTypeColumns(coll: ItemCollection) {
    this.columns = [];

    Object.keys(coll.types).forEach(type => {
      let collTypeRef = CollectionTypesHash[type];
      if(!collTypeRef) {
        collTypeRef = _.find(this.myTypes, { id: type });

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

  public selectType(id: string): void {
    this.selectedTypes[id] = !this.selectedTypes[id];
    if(!this.selectedTypes[id]) delete this.selectedTypes[id];
  }

  addTypesToCollection(coll: ItemCollection) {
    this.forceEditTypes = false;

    coll.types = {};
    Object.keys(this.selectedTypes).forEach(key => {
      if(!this.selectedTypes[key]) return;
      coll.types[key] = true;
    });

    this.firebase.updateCollection(coll);
  }

  hasTypes(coll: ItemCollection): boolean {
    if(!coll || !coll.types) return false;
    return Object.keys(coll.types).length > 0;
  }

  addNewItem(collection: ItemCollection, item?: Item) {

    const modal = this.modalCtrl.create(AddItemModal, {
      collection,
      item,
      columns: this.columns
    });

    modal.onDidDismiss((data) => {
      if(!data) return;
      const { item, mode } = data;
      if(!item) return;
      item.collectionFBID = this.uuid;

      if(mode === 'add') {
        this.firebase.addCollectionItem(item);
      } else if(mode === 'edit') {
        this.firebase.updateCollectionItem(item);
      }
    });

    modal.present();
  }

  editCollMenu($event, collection: ItemCollection) {
    const popover = this.popoverCtrl.create(ModifyCollectionPopover,{
      collection,
      columns: this.columns
    });

    popover.onDidDismiss(data => {
      if(!data) return;

      if(data.editTypes) this.forciblyEditTypes(collection);
      if(data.popNav)    this.navCtrl.pop();
    });

    popover.present({
      ev: $event
    });
  }

  private forciblyEditTypes(collection: ItemCollection) {
    this.forceEditTypes = true;
    this.selectedTypes = _.clone(collection.types);
  }

  public onTableContextMenu({ event, content }, collection: ItemCollection) {
    if(content.$$id) return;

    event.stopPropagation();
    event.preventDefault();

    const popover = this.popoverCtrl.create(ModifyItemPopover,{
      collection,
      item: content,
      columns: this.columns,
      addItemCallback: () => this.addNewItem(collection, content)
    });

    popover.present({
      ev: event
    });
  }

  public createMixin(mixin?: CollectionType) {

    const modal = this.modalCtrl.create(AddMixinModal, {
      item: mixin
    });

    modal.onDidDismiss((data) => {
      if(!data) return;
      const { item } = data;
      if(!item) return;

      this.firebase.updateCustomMixin(item);
    });

    modal.present();
  }

  public editMixinMenu($event, mixin: CollectionType) {
    $event.preventDefault();
    $event.stopPropagation();

    const popover = this.popoverCtrl.create(ModifyMixinPopover,{
      item: mixin,
      addItemCallback: () => this.createMixin(mixin)
    });

    popover.present({
      ev: $event
    });
  }

}
