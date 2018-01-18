import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppPublicCollectionPage } from './app-public-collection';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AppPublicCollectionPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AppPublicCollectionPage),
  ],
})
export class AppPublicCollectionPageModule {}
