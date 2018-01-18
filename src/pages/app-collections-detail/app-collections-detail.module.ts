import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCollectionsDetailPage } from './app-collections-detail';
import { TypeSearchFilterPipe } from './type-search-filter.pipe';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AppCollectionsDetailPage,
    TypeSearchFilterPipe,
  ],
  entryComponents: [
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(AppCollectionsDetailPage),
  ],
})
export class AppCollectionsDetailPageModule {}
