
type AttrType = 'string' | 'money' | 'number' | 'boolean';

export class Attr {
  name: string;
  prop: string;
  type: AttrType;
}

const NAME_ATTR: Attr =       { name: 'Name',     prop: 'name',       type: 'string' };
const PRICE_ATTR: Attr =      { name: 'Price',    prop: 'price',      type: 'money' };
const QTY_ATTR: Attr =        { name: 'Quantity', prop: 'quantity',   type: 'number' };
const FORSALE_ATTR: Attr =    { name: 'For Sale', prop: 'forSale',    type: 'boolean' };

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
      NAME_ATTR,
      PRICE_ATTR
    ]
  },
  {
    name: 'Board Games',
    id: 'BOARDGAME',
    desc: 'A mixin specifically for board games. Adds BGG search links to your items.',
    props: [
      NAME_ATTR
    ]
  },
  {
    name: 'For Trade',
    id: 'TRADINGCARDS',
    desc: 'A mixin specifically for selling and trading items. Adds quantity, as well as a "for sale" checkbox.',
    props: [
      NAME_ATTR,
      QTY_ATTR,
      FORSALE_ATTR
    ]
  },
  {
    name: 'Plain',
    desc: 'Just a plain list of items.',
    id: 'PLAIN',
    props: [
      NAME_ATTR
    ]
  }
];

export const CollectionTypesHash: { [key: string]: CollectionType } = CollectionTypes.reduce((prev, cur) => {
  prev[cur.id] = cur;
  return prev;
}, {});
