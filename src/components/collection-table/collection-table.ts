import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CollectionAttr } from '../../models/CollectionTypes';
import { Item } from '../../models/Collection';

import * as _ from 'lodash';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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

  public constructor(private firebase: FirebaseProvider) {}

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

  public updateItemInline(item: Item) {
    this.firebase.updateCollectionItem(item);
  }
}
