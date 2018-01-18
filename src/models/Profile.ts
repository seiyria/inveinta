
import { CollectionType } from './CollectionTypes';

export class Profile {
  collections: { [key: string]: boolean };
  mixins: { [key: string]: CollectionType }
}
