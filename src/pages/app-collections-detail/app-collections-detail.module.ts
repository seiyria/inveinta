import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppCollectionsDetailPage } from './app-collections-detail';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TypeSearchFilterPipe } from './type-search-filter.pipe';

@NgModule({
  declarations: [
    AppCollectionsDetailPage,
    TypeSearchFilterPipe,
  ],
  entryComponents: [
  ],
  imports: [
    NgxDatatableModule,
    IonicPageModule.forChild(AppCollectionsDetailPage),
  ],
})
export class AppCollectionsDetailPageModule {}
