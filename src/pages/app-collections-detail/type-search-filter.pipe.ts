import { Pipe, PipeTransform } from '@angular/core';
import { CollectionType } from '../../models/CollectionTypes';

@Pipe({
  name: 'typeSearchFilter',
})
export class TypeSearchFilterPipe implements PipeTransform {

  transform(value: CollectionType[], filter: string) {
    if(!value) return [];
    if(!filter) return value;
    return value.filter(item => (item.name + ' ' + item.desc).includes(filter));
  }
}
