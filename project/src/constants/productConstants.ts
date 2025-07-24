/* ------------------------------------------------------------------ */
/*  ProductConstants.tsx                                              */
/* ------------------------------------------------------------------ */

import { Product } from '../types';
import { decodeHTMLEntities } from '../utils/productUtils';

/* ---------- Sizes -------------------------------------------------- */

export const AVAILABLE_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'
];

/* ---------- Master colour table ------------------------------------ */
/*
   •  Keys that START with “#”  =  Printify hex → maps to nearest Gildan hex
   •  Keys that do NOT start with “#” = Human-readable Gildan colour name
                                         → maps to that Gildan hex
   You only need ONE named entry per final Gildan hex; any number of
   Printify hex keys can point to it and they’ll resolve automatically.
*/
export const COLOR_NAME_TO_HEX: Record<string, string> = {
  /* Printify → Gildan (hex → hex) */
  '#000000': '#25282A',  // Black
  '#DCD2BE': '#D7D2CB',  // Ice Grey
  '#642838': '#5B2B42',  // Maroon
  '#31221D': '#382F2D',  // Dark Chocolate
  '#005C70': '#005D6F',  // Galapagos Blue
  '#FF8E9D': '#DD74A1',  // Azalea
  '#FFFFFF': '#FFFFFF',  // White / PFD White
  '#F7E1B0': '#F4D1A1',  // Vegas Gold
  '#FFF6E3': '#FFFFFF',  // White / PFD White
  '#223B26': '#273B33',  // Forest
  '#454545': '#333F48',  // Heather Navy
  '#274D91': '#224D8F',  // Royal
  '#1A2237': '#263147',  // Navy
  '#A82235': '#AC2B37',  // Cherry Red
  '#B54557': '#B15533',  // Texas Orange
  '#F6F6F6': '#FFFFFF',  // White / PFD White
  '#D3D590': '#F4D1A1',  // Vegas Gold (alt)
  '#6A798E': '#4D6995',  // Heather Indigo
  '#FFB6C1': '#E4C6D4',  // Light Pink  (new)
  '#0F52BA': '#224D8F',  // Royal Blue  (new)
  /* --------------------------------------------------------------- */
  /* Named Gildan colours (one per final hex)                       */
  'Antique Cherry Red': '#971B2F',
  'Antique Heliconia':  '#AA0061',
  'Antique Irish Green':'#00843D',
  'Antique Jade Dome':  '#006269',
  'Antique Orange':     '#B33D26',
  'Antique Royal':      '#003087',
  'Antique Sapphire':   '#006A8E',
  'Ash':                '#C8C9C7',
  'Ash Grey':           '#C8C9C7',
  'Azalea':             '#DD74A1',
  'Baby Blue':          '#69B3E7',
  'Berry':              '#7F2952',
  'Black':              '#25282A',
  'Blackberry':         '#221C35',
  'Blue Dusk':          '#253746',
  'Bright Salmon':      '#E5554F',
  'Brown Savana':       '#7A6855',
  'Cactus':             '#788A7A',
  'Cardinal Red':       '#8A1538',
  'Caribbean Blue':     '#00A9CE',
  'Carolina Blue':      '#7BA4DB',
  'Cement':             '#AEAEAE',
  'Chalky Mint':        '#5CB8B2',
  'Chambray':           '#BDD6E6',
  'Charcoal':           '#66676C',
  'Charity Pink':       '#F8A3BC',
  'Cherry Red':         '#AC2B37',
  'Chestnut':           '#83635C',
  'Cobalt':             '#171C8F',
  'Coral Silk':         '#FB637E',
  'Cornsilk':           '#F0EC74',
  'Daisy':              '#FED101',
  'Dark Chocolate':     '#382F2D',
  'Dark Heather':       '#425563',
  'Dune Mist':          '#7A7256',
  'Dusty Rose':         '#E1BBB4',
  'Electric Green':     '#43B02A',
  'Flo Blue':           '#5576D1',
  'Forest':             '#273B33',
  'Galapagos Blue':     '#005D6F',
  'Garnet':             '#7D2935',
  'Gold':               '#EEAD1A',
  'Graphite Heather':   '#707372',
  'Gravel':             '#888B8D',
  'Gunmetal':           '#939694',
  'Heather Berry':      '#994878',
  'Heather Blue':       '#3A5DAE',
  'Heather Bronze':     '#C04C36',
  'Heather Cardinal':   '#9B2743',
  'Heather Caribbean Blue': '#00AFD7',
  'Heather Coral Silk': '#FF808B',
  'Heather Dark Green': '#3E5D58',
  'Heather Grey':       '#9EA2A2',
  'Heather Heliconia':  '#E24585',
  'Heather Indigo':     '#4D6995',
  'Heather Irish Green':'#5CAA7F',
  'Heather Maroon':     '#672E45',
  'Heather Military Green':'#7E7F74',
  'Heather Navy':       '#333F48',
  'Heather Orange':     '#FF8D6D',
  'Heather Purple':     '#614B79',
  'Heather Radiant Orchid':'#A15A95',
  'Heather Red':        '#BF0D3E',
  'Heather Royal':      '#307FE2',
  'Heather Sapphire':   '#0076A8',
  'Heather Seafoam':    '#40C1AC',
  'Heather Sport Dark Maroon':'#651D32',
  'Heather Sport Dark Navy':'#595478',
  'Heather Sport Royal':    '#1D4F91',
  'Heather Sport Scarlet Red':'#B83A4B',
  'Heliconia':          '#DB3E79',
  'Honey':              '#EDAESA',
  'Ice Grey':           '#D7D2CB',
  'Indigo Blue':        '#486D87',
  'Iris':               '#3975B7',
  'Irish Green':        '#00A74A',
  'Island Reef':        '#8FD6BD',
  'Jade Dome':          '#00857D',
  'Kelly':              '#00805E',
  'Kiwi':               '#89A84F',
  'Lagoon Blue':        '#4AC3E0',
  'Legion Blue':        '#1F495B',
  'Light Blue':         '#A3B3CB',
  'Light Pink':         '#E4C6D4',
  'Lilac':              '#563D82',
  'Lime':               '#92BF55',
  'Marbled Charcoal':   '#66676C',
  'Marbled Galapagos Blue':'#005D6F',
  'Marbled Heliconia':  '#DB3E79',
  'Marbled Navy':       '#263147',
  'Marbled Royal':      '#224D8F',
  'Maroon':             '#5B2B42',
  'Meadow':             '#046A38',
  'Metro Blue':         '#464E7E',
  'Midnight':           '#005670',
  'Military Green':     '#5E7461',
  'Mint Green':         '#A0CFAB',
  'Moss':               '#3D441E',
  'Mustard':            '#C3964D',
  'Natural':            '#E7CEB5',
  'Navy':               '#263147',
  'Royal':              '#224D8F',
  'Royal Blue':         '#0F52BA',
  'Vegas Gold':         '#F4D1A1',
  /* … add more named Gildan colours here as needed … */
};

/* ---------- Build reverse map once at load-time -------------------- */

const HEX_TO_NAME: Record<string, string> = (() => {
  const map: Record<string, string> = {};

  // First pass – final Gildan hex  ➜  name
  for (const [key, value] of Object.entries(COLOR_NAME_TO_HEX)) {
    if (!key.startsWith('#')) {
      map[value.toLowerCase()] = key;          // '#263147' ➜ 'Navy'
    }
  }

  // Second pass – each Printify hex ➜ same name as its Gildan target
  for (const [key, value] of Object.entries(COLOR_NAME_TO_HEX)) {
    if (key.startsWith('#')) {
      const name = map[value.toLowerCase()];
      if (name) map[key.toLowerCase()] = name;
    }
  }

  return map;
})();

/* ---------- Public helper ----------------------------------------- */

export function getColorNameFromHex(hex: string): string {
  if (!hex) return hex;
  return HEX_TO_NAME[hex.trim().toLowerCase()] ?? hex;
}

/* ---------- Product info builder (unchanged) ----------------------- */

export const getProductInfoSections = (product: Product) => [
  {
    id: 'about',
    title: 'About product',
    content: {
      designTitle: decodeHTMLEntities(product.name),
      designDescription: decodeHTMLEntities(
        product.description ??
          'Express yourself with this unique design from Saffron Society. Our premium quality t-shirts combine comfort with style, perfect for making a statement wherever you go.'
      ),
      features: [
        'Premium quality cotton construction',
        'Vibrant, long-lasting print',
        'Comfortable unisex fit',
        'Ethically sourced and produced',
      ],
    },
  },
  {
    id: 'details',
    title: 'Product details',
    content: [
      {
        title: 'Without side seams',
        description:
          'Knitted in one piece using tubular knit, it reduces fabric waste and makes the garment more attractive',
      },
      {
        title: 'Ribbed knit collar without seam',
        description:
          'Ribbed knit makes the collar highly elastic and helps retain its shape',
      },
      {
        title: 'Shoulder tape',
        description:
          'Twill tape covers the shoulder seams to stabilize the back of the garment and prevent stretching',
      },
      {
        title: 'Fiber composition',
        description:
          'Solid colors are 100% cotton; Heather colors are 50% cotton, 50% polyester (Sport Grey is 90% cotton, 10% polyester); Antique colors are 90% cotton, 10% polyester',
      },
      {
        title: 'Bigger shirt size',
        description:
          'The t-shirt runs bigger than usual giving extra space for comfort',
      },
      {
        title: 'Fabric',
        description:
          'Environmentally-friendly manufactured cotton that gives thicker vintage feel to the shirt. Long-lasting garment suitable for everyday use. The "Natural" color is made with unprocessed cotton, which results in small black flecks throughout the fabric',
      },
      {
        title: 'Age restrictions',
        description: 'For adults and teens',
      },
      {
        title: 'Other compliance information',
        description:
          'Meets the formaldehyde, phthalates, lead and flammability level requirements.',
      },
    ],
  },
  {
    id: 'care',
    title: 'Care instructions',
    content: [
      'Machine wash: cold (max 30 °C or 90 °F)',
      'Non-chlorine bleach as needed',
      'Do not tumble dry',
      'Do not iron',
      'Do not dry-clean',
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & delivery',
    content:
      'Accurate shipping options will be available in checkout after entering your full address.',
  },
  {
    id: 'returns',
    title: '30 day return policy',
    content: `Any goods purchased can only be returned in accordance with the Terms and Conditions and Returns Policy.

We want to make sure that you are satisfied with your order and we are committed to making things right in case of any issues. We will provide a solution in cases of any defects if you contact us within 30 days of receiving your order.

See Terms of Use`,
  },
  {
    id: 'gpsr',
    title: 'GPSR',
    content: {
      euRep:
        'EU representative: Saffron Society, support@saffronsociety.com, 21 Attlebery Crescent, Paris, ON, N3L 0H9, CA',
      productInfo:
        'Product information: Gildan 2000, 2-year warranty in EU and Northern Ireland as per Directive 1999/44/EC',
      warnings: 'Warnings, Hazard: For adults',
      care:
        'Care instructions: Machine wash: cold (max 30 °C or 90 °F), Non-chlorine bleach as needed, Do not tumble dry, Do not iron, Do not dry-clean',
    },
  },
];
