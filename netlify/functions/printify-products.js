// filepath: /workspaces/saffronsociety/netlify/functions/printify-products.js
import fetch from 'node-fetch';

export default async (req, context) => {
  console.log('[printify-products] Function invoked');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    // For testing, temporarily hardcode the credentials
    const shopId = process.env.PRINTIFY_SHOP_ID || "22019146";
    const apiToken = process.env.PRINTIFY_API_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjI3ODAzZTIwZmJkZjQ5OTBlMTE4OWFhYjVlZDQ3NjQxZDJjNWUyYzI0ODRjNzVkOWRkMzM2MjIyZGEzYzQ1ZTVjYjcyMTY2NjJjMGViMTUxIiwiaWF0IjoxNzQ1NzAyNTYzLjA3Nzk5NiwibmJmIjoxNzQ1NzAyNTYzLjA3Nzk5OCwiZXhwIjoxNzc3MjM4NTYzLjA2NjcwNywic3ViIjoiOTg4MzgxNSIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiLCJ1c2VyLmluZm8iXX0.jIaqK4aY31rm2csjmVPVEWPanztfP4KT0V75l1qZmVYKzSiF6wTVqbWvhioemzoYB-E-x0VwKlhqCaT-FxdOxTFAsEz1jEVFnO2E8DBwP9xzZfM0f7HsDii88nC1EW_PF_QyOMc1cfn2GTNFtZ863PEE6OTjk0gdp8zd-cb16rCC1GbdQTH5do4uF3pNptLHNn_aen2mlS8P8n_kL9at1UzglF1U6xMWNnQN1d11Ro2MYKQCVazea4LFnR0UAOZbkgC6gVJ9fxzjL4pvjWjTyBzoDpTRHIyYszHb6w7d17DXDmhDCNV59NTDuKzk8LNi_fl8jN_I7RrRYPY3yrxSu1IrysE4-0gpwH4YDLIRZGb7HYMuJSCffXd5tfxr95_VcVltWUJUrWjM93eNNNf_sIb2y1DvAWDINSZy_A_oVepMshmzzBBQpCmtajgmNOU7Q8XZ2RZ9Fkq-B8X2EHahsubNdPY0P01WRO7oCNy8ofITQCydLqk4gJf-toXu11SiXX4sbTpRF0rj7dsWYKLwkMDCk_JeK166Ybmv4jFGvJAh0e2JvzDaTZoQ6oORmvWkQQqCnuEAHMUG6T1GKKA02DXoTLvJSUn1v4OiupohQbH9ZPXRs4TNO0CnI4a_uWiofGFZy0fZ2q38dDnWoFOFLiTk-gYfKsIzntJr52Dpn_Y";
    
    console.log('[printify-products] Shop ID:', shopId ? 'Set' : 'Not set');
    console.log('[printify-products] API Token:', apiToken ? 'Set' : 'Not set');

    // If no credentials, return mock data
    if (!shopId || !apiToken || shopId === 'YOUR_PRINTIFY_SHOP_ID') {
      console.log('[printify-products] Using mock data (no valid credentials)');
      const mockProducts = [
        {
          id: "1",
          title: "Baazigar (1993) - Classic Bollywood Thriller",
          name: "Baazigar (1993) - Classic Bollywood Thriller",
          description: "Channel the iconic villain energy with this legendary Bollywood design featuring the unforgettable Mogambo character.",
          price: 21.37,
          image: "/assets/male-model.png",
          images: ["/assets/male-model.png"],
          category: "T-Shirts",
          tags: ["bollywood", "thriller", "classic", "baazigar"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" },
            { name: "Navy", hex: "#1A2237" },
            { name: "Forest", hex: "#223B26" }
          ],
          variants: [
            { id: "v1", title: "Black / S", price: 21.37, is_enabled: true },
            { id: "v2", title: "Black / M", price: 21.37, is_enabled: true },
            { id: "v3", title: "White / S", price: 21.37, is_enabled: true },
            { id: "v4", title: "Navy / S", price: 21.37, is_enabled: true }
          ]
        },
        {
          id: "2", 
          title: "Mere Paas Maa Hai - Emotional Classic",
          name: "Mere Paas Maa Hai - Emotional Classic",
          description: "The ultimate emotional dialogue from Bollywood history - a tribute to mother's love and family values in iconic cinema.",
          price: 24.99,
          image: "/assets/female-model.png",
          images: ["/assets/female-model.png"],
          category: "T-Shirts", 
          tags: ["bollywood", "emotional", "family", "classic"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Navy", hex: "#1A2237" },
            { name: "Maroon", hex: "#642838" },
            { name: "Ice Grey", hex: "#DCD2BE" },
            { name: "Royal", hex: "#274D91" }
          ],
          variants: [
            { id: "v3", title: "Navy / S", price: 24.99, is_enabled: true },
            { id: "v4", title: "Navy / M", price: 24.99, is_enabled: true },
            { id: "v5", title: "Maroon / S", price: 24.99, is_enabled: true }
          ]
        },
        {
          id: "3",
          title: "Sholay Heroes Tribute - Friendship Forever",
          name: "Sholay Heroes Tribute - Friendship Forever",
          description: "Celebrate the friendship and heroism of Bollywood's greatest duo in this artistic tribute to the timeless classic Sholay.",
          price: 26.99,
          image: "/assets/male-model-2.png",
          images: ["/assets/male-model-2.png"], 
          category: "T-Shirts",
          tags: ["sholay", "friendship", "heroes", "classic"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Maroon", hex: "#642838" },
            { name: "Forest", hex: "#223B26" },
            { name: "Dark Chocolate", hex: "#31221D" },
            { name: "Cherry Red", hex: "#A82235" }
          ],
          variants: [
            { id: "v5", title: "Maroon / S", price: 26.99, is_enabled: true },
            { id: "v6", title: "Maroon / M", price: 26.99, is_enabled: true },
            { id: "v7", title: "Forest / S", price: 26.99, is_enabled: true }
          ]
        },
        {
          id: "4",
          title: "Vintage Cinema Magic - Golden Age",
          name: "Vintage Cinema Magic - Golden Age",
          description: "A nostalgic design celebrating the golden age of Indian cinema with artistic elements and retro typography.",
          price: 28.99,
          image: "/assets/male-model-3.png",
          images: ["/assets/male-model-3.png"],
          category: "T-Shirts",
          tags: ["vintage", "cinema", "retro", "golden-age"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Royal", hex: "#274D91" },
            { name: "Cherry Red", hex: "#A82235" },
            { name: "Vegas Gold", hex: "#F7E1B0" },
            { name: "Azalea", hex: "#FF8E9D" },
            { name: "Galapagos Blue", hex: "#005C70" }
          ],
          variants: [
            { id: "v7", title: "Royal / S", price: 28.99, is_enabled: true },
            { id: "v8", title: "Royal / M", price: 28.99, is_enabled: true },
            { id: "v9", title: "Cherry Red / S", price: 28.99, is_enabled: true }
          ]
        }
      ];
      
      return new Response(JSON.stringify(mockProducts), { 
        status: 200, 
        headers 
      });
    }

    // Fetch from Printify API
    const printifyUrl = `https://api.printify.com/v1/shops/${shopId}/products.json`;
    console.log('[printify-products] Fetching from Printify API');
    
    const response = await fetch(printifyUrl, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    });

    console.log('[printify-products] Printify API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[printify-products] Printify API error:', errorText);
      throw new Error(`Printify API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[printify-products] Products fetched:', data.data?.length || 0);

    // Transform Printify products to our format
    const products = data.data?.map(product => {
      console.log('[printify-products] Processing product:', product.title);
      
      // Extract colors from variant titles since Printify doesn't provide color options separately
      const colorSet = new Set();
      const colorMap = {};
      
      // Look through all variants and extract color names from titles
      product.variants?.forEach(variant => {
        if (variant.is_enabled && variant.title) {
          // Extract color from variant title (format is usually "Color / Size")
          const parts = variant.title.split(' / ');
          if (parts.length >= 2) {
            const colorName = parts[0].trim();
            if (colorName && colorName !== '') {
              colorSet.add(colorName);
              if (!colorMap[colorName]) {
                colorMap[colorName] = mapColorNameToHex(colorName);
              }
            }
          }
        }
      });

      const colors = Array.from(colorSet).map(colorName => ({
        name: colorName,
        hex: colorMap[colorName] || '#000000'
      }));

      // Get the first available image
      const firstImage = product.images?.[0]?.src || '/assets/logo_big.png';
      
      // Calculate price - get the minimum price from enabled variants
      let minPrice = 24.99;
      if (product.variants && product.variants.length > 0) {
        const enabledVariants = product.variants.filter(v => v.is_enabled);
        if (enabledVariants.length > 0) {
          const prices = enabledVariants.map(v => parseFloat(v.price) / 100);
          minPrice = Math.min(...prices);
        }
      }

      const transformedProduct = {
        id: product.id,
        title: product.title,
        name: product.title,
        description: product.description || 'A stylish Bollywood-inspired t-shirt design',
        price: minPrice,
        image: firstImage,
        images: product.images?.map(img => img.src) || [firstImage],
        colors,
        category: 'T-Shirts',
        tags: Array.isArray(product.tags) ? product.tags : ['bollywood', 'vintage'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        variants: product.variants?.filter(v => v.is_enabled) || []
      };
      
      console.log('[printify-products] Transformed product colors for', product.title, ':', colors);
      return transformedProduct;
    }) || [];
    
    // Helper function to map color names to hex codes
    function mapColorNameToHex(colorName) {
      const colorMapping = {
        'Black': '#000000',
        'White': '#FFFFFF', 
        'Navy': '#1A2237',
        'Red': '#A82235',
        'Maroon': '#642838',
        'Forest': '#223B26',
        'Forest Green': '#223B26',
        'Royal': '#274D91',
        'Heather Navy': '#454545',
        'Dark Heather': '#454545',
        'Ice Grey': '#DCD2BE',
        'Dark Chocolate': '#31221D',
        'Galapagos Blue': '#005C70',
        'Azalea': '#FF8E9D',
        'Vegas Gold': '#F7E1B0',
        'Cherry Red': '#A82235',
        'Antique Cherry Red': '#A82235',
        'Texas Orange': '#B54557',
        'Heather Indigo': '#6A798E',
        'Indigo Blue': '#4B0082',
        'Purple': '#800080',
        'Light Blue': '#87CEEB',
        'Sand': '#F4D1A1',
        'Light Pink': '#FFB6C1',
        'Safety Pink': '#FF1493',
        'Sapphire': '#0F52BA',
        'Blue Dusk': '#4682B4',
        'Sport Grey': '#8C8C8C',
        'Orange': '#FF8C00',
        'Gold': '#FFD700',
        'Natural': '#F5F5DC',
        'Tangerine': '#FF8C00',
        'Olive': '#808000',
        'Cardinal Red': '#C41E3A',
        'Jade Dome': '#00A86B',
        'Heather Sapphire': '#0F52BA'
      };
      return colorMapping[colorName] || '#666666';
    }

    return new Response(JSON.stringify(products), { 
      status: 200, 
      headers 
    });

  } catch (error) {
    console.error('[printify-products] Error:', error);
    
    // Return a proper error response
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch products', 
        message: error.message 
      }), 
      { 
        status: 500, 
        headers 
      }
    );
  }
};

export const config = {
  path: "/api/printify-products"
};