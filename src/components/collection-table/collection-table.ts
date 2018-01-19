import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CollectionAttr } from '../../models/CollectionTypes';
import { Item } from '../../models/Collection';

import * as _ from 'lodash';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AlertController } from 'ionic-angular';
import { NotifierProvider } from '../../providers/notifier/notifier';

@Component({
  selector: 'collection-table',
  templateUrl: 'collection-table.html'
})
export class CollectionTableComponent {

  @Output()
  public tableContextMenu = new EventEmitter();

  @Input()
  public canInteract: boolean;

  @Input()
  public set allItems(items: Item[]) {
    this._allItems = items;
    this.updateItemFilter();
  }

  public get allItems(): Item[] {
    return this._allItems;
  }

  @Input()
  public set allColumns(cols: CollectionAttr[]) {
    this.columns = cols;
    this.displayColumns = _.reject(this.columns, prop => prop.hidden);
    this.hiddenColumns  = _.filter(this.columns, prop => prop.hidden);
  }

  public get shouldExpand(): boolean {
    return this.columns.length !== this.displayColumns.length;
  }

  public get ngxDataTableIcons() {
    return {
      sortAscending: 'ion-md-arrow-dropup',
      sortDescending: 'ion-md-arrow-dropdown',
      pagerPrevious: 'ion-ios-arrow-dropleft-circle',
      pagerNext: 'ion-ios-arrow-dropright-circle',
      pagerLeftArrow: 'ion-ios-arrow-back',
      pagerRightArrow: 'ion-ios-arrow-forward'
    };
  }

  private _allItems: Item[] = [];
  private columns: CollectionAttr[] = [];
  public displayColumns: CollectionAttr[] = [];
  private hiddenColumns: CollectionAttr[] = [];
  public itemFilterQuery: string = '';
  public visibleItems: Item[] = [];

  public constructor(
    private firebase: FirebaseProvider,
    private notifier: NotifierProvider,
    private alertCtrl: AlertController
  ) {}

  public getComputeString(attr: CollectionAttr, item: Item) {
    if(attr.computeString) return attr.computeString.split('{name}').join(encodeURIComponent(item.name));
    if(attr.compute) return attr.compute(item);
    return '';
  }

  public canItemExpand(item: Item): boolean {
    return _.some(this.hiddenColumns, col => item[col.prop]);
  }

  public updateItemFilter() {
    if(!this.itemFilterQuery) {
      this.visibleItems = this.allItems;
      return;
    }

    this.visibleItems = this.allItems.filter(item => {
      if(!item.name) return false;
      return item.name.toLowerCase().includes(this.itemFilterQuery.toLowerCase());
    });
  }

  public getCellClass(column): () => string {
    return () => ` column-type-${column.type} ${this.canInteract ? 'can-interact' : 'no-interact'}`;
  }

  public updateItemInline(item: Item) {
    this.firebase.updateCollectionItem(item);
  }

  public checkout(item: Item, prop: string): void {
    this.alertCtrl.create({
      title: `Check out "${item.name}"`,
      subTitle: `Who do you want to check "${item.name}" out to?`,
      inputs: [
        {
          name: 'name',
          placeholder: 'Checked out to'
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Check Out',
          handler: ({ name }) => {
            name = name.trim();
            if(!name) return;
            item[prop] = name;
            this.firebase.updateCollectionItem(item);
            this.notifier.toast(`Successfully checked "${item.name}" out to ${name}!`);
          }
        }
      ]
    }).present();
  }

  public checkin(item: Item, prop: string): void {
    this.alertCtrl.create({
      title: `Check in "${item.name}"`,
      subTitle: `Are you sure you want to check in "${item.name}"?`,
      buttons: [
        'No, Not Yet',
        {
          text: 'Yes, Check In',
          handler: () => {
            delete item[prop];
            this.firebase.updateCollectionItem(item);
            this.notifier.toast(`Successfully checked "${item.name}" back in!`);
          }
        }
      ]
    }).present();
  }
}
