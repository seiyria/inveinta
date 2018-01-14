import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage({
  name: 'CollectionsDetail',
  segment: 'collections/:uuid',
  defaultHistory: ['Collections']
})
@Component({
  selector: 'page-app-collections-detail',
  templateUrl: 'app-collections-detail.html',
})
export class AppCollectionsDetailPage implements OnInit {

  private uuid: string;
  public columns = [];

  constructor(
    public navParams: NavParams,
    public firebase: FirebaseProvider
  ) {}

  ngOnInit() {
    this.uuid = this.navParams.get('uuid');
    this.firebase.loadCollectionItems(this.uuid);

    this.columns.push({ name: 'Name', prop: 'name' });
  }
}
