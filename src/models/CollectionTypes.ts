
type AttrType = 'string' | 'money' | 'number';

export class Attr {
  display: string;
  key: string;
  type: AttrType;
}

const NAME_ATTR: Attr =   { display: 'Name', key: 'name', type: 'string' };
const PRICE_ATTR: Attr =  { display: 'Price', key: 'price', type: 'money' };
const QTY_ATTR: Attr =    { display: 'Quantity', key: 'quantity', type: 'number' };

export class CollectionType {
  name: string;
  id: string;
  props: Attr[];
}

export const CollectionTypes: CollectionType[] = [
  {
    name: 'Plain',
    id: 'PLAIN',
    props: [
      NAME_ATTR
    ]
  },
  {
    name: 'Value',
    id: 'VALUE',
    props: [
      NAME_ATTR,
      PRICE_ATTR
    ]
  },
  {
    name: 'Board Game',
    id: 'BOARDGAME',
    props: [
      NAME_ATTR
    ]
  },
  {
    name: 'Trading Cards',
    id: 'TRADINGCARDS',
    props: [
      NAME_ATTR,
      QTY_ATTR
    ]
  }
];
