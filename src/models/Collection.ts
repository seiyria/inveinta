
export class ItemCollection {

  // the firebase id representing this collection
  id: string;
  name: string;

  createdAt: number;
  owner: string;

  // collection types
  types: { [key: string]: boolean };

  // user uids shared with
  sharedWith: { [key: string]: boolean };

  itemCount: number;
}

export class Item {
  // the angularfire id
  id: string;

  // the collection id
  collectionFBID: string;
  name: string;
}
