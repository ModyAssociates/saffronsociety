// filepath: /workspaces/saffronsociety/netlify/functions/printify-products.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const PRINTIFY_API_TOKEN = process.env.PRINTIFY_API_TOKEN;
    const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;

    console.log('[printify-products] Environment check:', {
      hasToken: !!PRINTIFY_API_TOKEN,
      hasShopId: !!PRINTIFY_SHOP_ID
    });

    // If no credentials, return mock data
    if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
      console.log('[printify-products] No Printify credentials, returning mock data');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(getMockProducts())
      };
    }

    // Fetch from Printify API
    const response = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('[printify-products] Printify API error:', response.status);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(getMockProducts())
      };
    }

    const data = await response.json();
    const products = (data.data || []).map(transformProduct);

    console.log(`[printify-products] Returning ${products.length} products`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products)
    };

  } catch (error) {
    console.error('[printify-products] Error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(getMockProducts())
    };
  }
}

function transformProduct(product) {
  const variants = product.variants || [];
  const images = product.images || [];
  
  // Extract unique colors from variants
  const colorSet = new Set();
  variants.forEach(variant => {
    if (variant.options?.color) {
      colorSet.add(variant.options.color);
    }
  });

  // Get first variant price or default
  const price = variants[0]?.price ? variants[0].price / 100 : 29.99;

  return {
    id: product.id,
    title: product.title,
    description: product.description || '',
    price: price,
    image: images[0]?.src || '',
    images: images.map(img => img.src || img).filter(Boolean),
    colors: Array.from(colorSet).map(color => ({
      name: color,
      hex: getColorHex(color)
    })),
    variants: variants
  };
}

function getColorHex(colorName) {
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#1A2237',
    'Red': '#A82235',
    'Maroon': '#642838',
    'Forest': '#223B26',
    'Royal': '#274D91',
    'Sport Grey': '#C0C0C0',
    'Heather Grey': '#B0B0B0'
  };
  return colorMap[colorName] || '#808080';
}

function getMockProducts() {
  return [
    {
      id: '1',
      title: 'Bhoot Bangla Retro Tee',
      description: 'A tribute to the cult classic horror film',
      price: 29.99,
      image: '/src/assets/logo_big.png',
      images: ['/src/assets/logo_big.png'],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' }
      ],
      variants: []
    },
    {
      id: '2',
      title: 'Andaz Apna Apna Classic',
      description: 'Celebrating the iconic comedy duo',
      price: 29.99,
      image: '/src/assets/logo_big.png',
      images: ['/src/assets/logo_big.png'],
      colors: [
        { name: 'Navy', hex: '#1A2237' },
        { name: 'Red', hex: '#A82235' }
      ],
      variants: []
    }
  ];
}