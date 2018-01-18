import { NgModule } from '@angular/core';
import { CollectionTableComponent } from './collection-table/collection-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MarkdownModule } from 'angular2-markdown';
import { IonicModule } from 'ionic-angular/module';

@NgModule({
  declarations: [CollectionTableComponent],
  imports: [
    MarkdownModule,
	NgxDatatableModule,
	IonicModule
  ],
  exports: [CollectionTableComponent]
})
export class ComponentsModule {}
