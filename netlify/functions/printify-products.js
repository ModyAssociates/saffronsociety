import fetch from 'node-fetch';

export const handler = async (event) => {
  const apiToken = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!apiToken || !shopId) {
    console.error('Missing Printify API credentials');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing API credentials' }),
    };
  }

  try {
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Printify API error:', response.status, response.statusText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch products' }),
      };
    }

    const data = await response.json();
    console.log('Printify API response:', JSON.stringify(data, null, 2));

    // Sort products by created_at date (most recent first)
    const sortedProducts = data.data.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA; // Most recent first
    });

    // Transform Printify data to match our Product interface
    const products = sortedProducts.map(product => {
      // Get the first image from variants or product images
      let primaryImage = null;
      if (product.images && product.images.length > 0) {
        primaryImage = product.images[0].src;
      } else if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
        primaryImage = product.variants[0].images[0].src;
      }

      // Extract unique colors from variants
      const colors = [];
      const colorSet = new Set();
      
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.options && variant.options.color) {
            const colorHex = variant.options.color;
            if (!colorSet.has(colorHex)) {
              colorSet.add(colorHex);
              colors.push({
                name: variant.title || 'Color',
                hex: colorHex
              });
            }
          }
        });
      }

      // Get all variant images
      const images = [];
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach(img => {
              if (img.src && !images.some(existingImg => existingImg.src === img.src)) {
                images.push({
                  src: img.src,
                  color: variant.options?.color || null,
                  position: img.position || 'front'
                });
              }
            });
          }
        });
      }

      return {
        id: product.id,
        name: product.title,
        description: product.description || '',
        price: product.variants?.[0]?.price ? parseFloat(product.variants[0].price) / 100 : 0,
        image: primaryImage || '',
        images: images,
        category: 'T-Shirts',
        sizes: product.variants?.map(v => v.title).filter(Boolean) || [],
        colors: colors,
        variants: product.variants?.map(variant => ({
          id: variant.id,
          size: variant.title,
          price: variant.price ? parseFloat(variant.price) / 100 : 0,
          available: variant.is_enabled || false,
          color: variant.options?.color || null,
          images: variant.images || []
        })) || [],
        created_at: product.created_at
      };
    });

    console.log(`Returning ${products.length} products from Printify (sorted by most recent)`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    console.error('Error fetching from Printify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};