
import { ItemCollection } from './Collection';

type AttrType = 'string' | 'money' | 'number' | 'boolean' | 'computed';

export class Attr {
  name: string;
  prop: string;
  type: AttrType;

  // used for the display value
  computeDisplay?: (coll: ItemCollection) => string;

  // used for an internal value, whenever
  compute?: (coll: ItemCollection) => string;
}

export const NAME_ATTR: Attr =       { name: 'Name',     prop: 'name',       type: 'string' };
export const PRICE_ATTR: Attr =      { name: 'Price',    prop: 'price',      type: 'money' };
export const QTY_ATTR: Attr =        { name: 'Quantity', prop: 'quantity',   type: 'number' };
export const FORSALE_ATTR: Attr =    { name: 'For Sale', prop: 'forSale',    type: 'boolean' };
export const BGG_ATTR: Attr =        { name: 'BoardGameGeek', prop: 'bggLink', type: 'computed',
    computeDisplay: (coll) => 'BGG Search',
    compute: (coll) => `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(coll.name)}` };

export class CollectionType {
  // display name of the type
  name: string;

  // the internal id. never change this.
  id: string;

  // the description of the type
  desc: string;

  // the properties added by the type
  props: Attr[];
}

export const CollectionTypes: CollectionType[] = [
  {
    name: 'Value Tracker',
    id: 'VALUE',
    desc: 'A mixin that associates a dollar value with your items. Useful if you have a wishlist or lots of electronics.',
    props: [
      PRICE_ATTR
    ]
  },
  {
    name: 'Board Games',
    id: 'BOARDGAME',
    desc: 'A mixin specifically for board games. Adds BGG search links to your items.',
    props: [
      BGG_ATTR
    ]
  },
  {
    name: 'For Trade',
    id: 'TRADINGCARDS',
    desc: 'A mixin specifically for selling and trading items. Adds quantity, as well as a "for sale" checkbox.',
    props: [
      QTY_ATTR,
      FORSALE_ATTR
    ]
  },
  {
    name: 'Plain',
    desc: 'Just a plain list of items.',
    id: 'PLAIN',
    props: [
    ]
  }
];

export const CollectionTypesHash: { [key: string]: CollectionType } = CollectionTypes.reduce((prev, cur) => {
  prev[cur.id] = cur;
  return prev;
}, {});
