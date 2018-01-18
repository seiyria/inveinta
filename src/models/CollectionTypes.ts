
import { Item } from './Collection';

type AttrType = 'string' | 'money' | 'number' | 'boolean' | 'choice' | 'rating' | 'markdown' | 'imageURL' | 'computed';

export class CollectionAttr {
  name: string;
  prop: string;
  type: AttrType;
  hidden?: boolean;
  options?: string[];
  optionString?: string;

  // used for the display value
  computeDisplayString?: string;
  computeDisplay?: (coll: Item) => string;

  // used for an internal value, whenever
  compute?: (coll: Item) => string;
  computeString?: string;
}

const PRICE_ATTR: CollectionAttr =      { name: 'Price',    prop: 'price',      type: 'money' };

const QTY_ATTR: CollectionAttr =        { name: 'Quantity', prop: 'quantity',   type: 'number' };
const FORSALE_ATTR: CollectionAttr =    { name: 'For Sale', prop: 'forSale',    type: 'boolean' };

const BGG_ATTR: CollectionAttr =        { name: 'BoardGameGeek', prop: 'bggLink', type: 'computed',
    computeDisplayString: 'BGG Search',
    computeString: `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q={name}` };

const HLTB_ATTR: CollectionAttr =       { name: 'HowLongToBeat', prop: 'hltbLink', type: 'computed',
  computeDisplayString: 'HLTB Search',
  computeString: `https://howlongtobeat.com/?q={name}` };

const GFAQ_ATTR: CollectionAttr =       { name: 'GameFAQs', prop: 'gamefaqsLink', type: 'computed',
  computeDisplayString: 'GameFAQs Search',
  computeString: `https://www.gamefaqs.com/search?game={name}` };

const TCGP_ATTR: CollectionAttr =       { name: 'TCGPlayer', prop: 'tcgpLink', type: 'computed',
  computeDisplayString: 'TCGPlayer Search',
  computeString: `https://shop.tcgplayer.com/productcatalog/product/show?ProductType=All&ProductName={name}` };

const META_ATTR: CollectionAttr =       { name: 'Metacritic', prop: 'metacriticLink', type: 'computed',
  computeDisplayString: 'Metacritic Search',
  computeString: `http://www.metacritic.com/search/all/{name}/results` };

const GENRE_ATTR: CollectionAttr =      { name: 'Genre',     prop: 'genre',       type: 'string' };
const AUTHOR_ATTR: CollectionAttr =     { name: 'Author',    prop: 'author',      type: 'string' };

const GAMESYSTEM_ATTR: CollectionAttr = { name: 'Game System', prop: 'gameSystem',  type: 'string' };

const MTG_RARITY_ATTR: CollectionAttr = { name: 'Rarity', prop: 'mtgRarity', type: 'choice',
  options: ['Common', 'Uncommon', 'Rare', 'Mythic Rare'] };

const MTG_COLOR_ATTR: CollectionAttr =  { name: 'Color', prop: 'mtgColor', type: 'choice',
  options: ['Black', 'Red', 'White', 'Blue', 'Green'] };

const MTG_SET_ATTR: CollectionAttr =    { name: 'Set',    prop: 'set',      type: 'string' };

const RATING_ATTR: CollectionAttr =     { name: 'Rating', prop: 'rating',   type: 'rating' };

const MARKDOWN_ATTR: CollectionAttr =   { name: 'Description', prop: 'descriptionMD', type: 'markdown', hidden: true };

const COOK_TIME_ATTR: CollectionAttr =    { name: 'Cook Time', prop: 'cookTime', type: 'string' };
const IMAGE_ATTR: CollectionAttr =   { name: 'Image URL', prop: 'imageURL', type: 'imageURL', hidden: true };

export const RATING_DISPLAY_HELPER = (item) => {
  item['ratingValue'] = item['ratingValue'] || 0;

  const actualRating = Array(item['ratingValue']).fill(null).map(x => '★');
  const filler = Array(5 - actualRating.length).fill(null).map(x => '☆');

  return actualRating.join('') + filler.join('');
};

export class CollectionType {
  // display name of the type
  name: string;

  // the internal id. never change this.
  id: string;

  // the description of the type
  desc: string;

  // the properties added by the type
  props: CollectionAttr[];
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
    name: 'Star Ratings',
    id: 'STARRATING',
    desc: 'A mixin that adds star ratings (1-5) to your items.',
    props: [
      RATING_ATTR
    ]
  },
  {
    name: 'Recipes',
    id: 'RECIPE',
    desc: 'A mixin that adds cook time, long description and an image link to your items.',
    props: [
      MARKDOWN_ATTR,
      COOK_TIME_ATTR,
      IMAGE_ATTR
    ]
  },
  {
    name: 'Extended Description',
    id: 'LONGDESC',
    desc: 'A mixin that adds a long description to your items (supports markdown).',
    props: [
      MARKDOWN_ATTR
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
