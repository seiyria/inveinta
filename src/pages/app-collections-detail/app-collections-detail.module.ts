import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCollectionsDetailPage } from './app-collections-detail';

@NgModule({
  declarations: [
    AppCollectionsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AppCollectionsDetailPage),
  ],
})
export class AppCollectionsDetailPageModule {}
