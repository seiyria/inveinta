
import { ItemCollection } from './Collection';

type AttrType = 'string' | 'money' | 'number' | 'boolean' | 'choice' | 'computed';

export class Attr {
  name: string;
  prop: string;
  type: AttrType;
  options?: string[];

  // used for the display value
  computeDisplay?: (coll: ItemCollection) => string;

  // used for an internal value, whenever
  compute?: (coll: ItemCollection) => string;
}

// const NAME_ATTR: Attr =       { name: 'Name',     prop: 'name',       type: 'string' };

const PRICE_ATTR: Attr =      { name: 'Price',    prop: 'price',      type: 'money' };

const QTY_ATTR: Attr =        { name: 'Quantity', prop: 'quantity',   type: 'number' };
const FORSALE_ATTR: Attr =    { name: 'For Sale', prop: 'forSale',    type: 'boolean' };

const BGG_ATTR: Attr =        { name: 'BoardGameGeek', prop: 'bggLink', type: 'computed',
    computeDisplay: (coll) => 'BGG Search',
    compute: (coll) => `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(coll.name)}` };

const HLTB_ATTR: Attr =       { name: 'HowLongToBeat', prop: 'hltbLink', type: 'computed',
  computeDisplay: (coll) => 'HLTB Search',
  compute: (coll) => `https://howlongtobeat.com/?q=${encodeURIComponent(coll.name)}` };

const GFAQ_ATTR: Attr =       { name: 'GameFAQs', prop: 'gamefaqsLink', type: 'computed',
  computeDisplay: (coll) => 'GameFAQs Search',
  compute: (coll) => `https://www.gamefaqs.com/search?game=${encodeURIComponent(coll.name)}` };

const TCGP_ATTR: Attr =       { name: 'TCGPlayer', prop: 'tcgpLink', type: 'computed',
  computeDisplay: (coll) => 'TCGPlayer Search',
  compute: (coll) => `https://shop.tcgplayer.com/productcatalog/product/show?ProductType=All&ProductName=${encodeURIComponent(coll.name)}` };

const META_ATTR: Attr =       { name: 'Metacritic', prop: 'metacriticLink', type: 'computed',
  computeDisplay: (coll) => 'Metacritic Search',
  compute: (coll) => `http://www.metacritic.com/search/all/${encodeURIComponent(coll.name)}/results` };

const GENRE_ATTR: Attr =      { name: 'Genre',     prop: 'genre',       type: 'string' };
const AUTHOR_ATTR: Attr =     { name: 'Author',    prop: 'author',      type: 'string' };

const GAMESYSTEM_ATTR: Attr = { name: 'Game System', prop: 'gameSystem',  type: 'string' };

const MTG_RARITY_ATTR: Attr = { name: 'Rarity', prop: 'mtgRarity', type: 'choice',
  options: ['Common', 'Uncommon', 'Rare', 'Mythic Rare'] };

const MTG_COLOR_ATTR: Attr =  { name: 'Color', prop: 'mtgColor', type: 'choice',
  options: ['Black', 'Red', 'White', 'Blue', 'Green'] };

const MTG_SET_ATTR: Attr =    { name: 'Set',    prop: 'set',      type: 'string' };

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
    name: 'For Trade',
    id: 'FORTRADE',
    desc: 'A mixin specifically for selling and trading items. Adds quantity, as well as a "for sale" checkbox.',
    props: [
      QTY_ATTR,
      FORSALE_ATTR
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
    name: 'Video Games',
    id: 'VIDEOGAME',
    desc: 'A mixin specifically for video games. Adds Game System, How Long To Beat and GameFAQs search links to your items.',
    props: [
      GAMESYSTEM_ATTR,
      HLTB_ATTR,
      GFAQ_ATTR
    ]
  },
  {
    name: 'Magic: The Gathering',
    id: 'MTG',
    desc: 'A mixin specifically for Magic: The Gathering. Adds rarity, type, color, set.',
    props: [
      MTG_RARITY_ATTR,
      MTG_COLOR_ATTR,
      MTG_SET_ATTR
    ]
  },
  {
    name: 'Books',
    id: 'BOOK',
    desc: 'A mixin specifically for books. Adds genre and author.',
    props: [
      GENRE_ATTR,
      AUTHOR_ATTR
    ]
  },
  {
    name: 'Game Books',
    id: 'GAMEBOOK',
    desc: 'A mixin specifically for game books. Adds game system.',
    props: [
      GAMESYSTEM_ATTR
    ]
  },
  {
    name: 'TCGPlayer',
    id: 'TCGPLAYER',
    desc: 'A mixin that adds TCGPlayer search links to your items.',
    props: [
      TCGP_ATTR
    ]
  },
  {
    name: 'Metacritic',
    id: 'METACRITIC',
    desc: 'A mixin that adds Metacritic search links to your items.',
    props: [
      META_ATTR
    ]
  },
  {
    name: 'Plain',
    desc: 'Just a plain list of items.',
    id: 'PLAIN',
    props: []
  }
];

export const CollectionTypesHash: { [key: string]: CollectionType } = CollectionTypes.reduce((prev, cur) => {
  prev[cur.id] = cur;
  return prev;
}, {});
