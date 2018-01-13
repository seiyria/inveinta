
export class ItemCollection {
  name: string;
  uuid: string;
  createdAt: number;
  owner: string;

  // collection types
  types: { [key: string]: string };

  // user uids shared with
  sharedWith: { [key: string]: boolean };

  itemCount: number;
}
