import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCollectionsPage } from './app-collections';

@NgModule({
  declarations: [
    AppCollectionsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppCollectionsPage),
  ],
})
export class AppCollectionsPageModule {}
