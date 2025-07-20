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
          name: "Mogambo Khush Hua Tee",
          description: "Channel the iconic villain energy with this legendary Bollywood design featuring the unforgettable Mogambo character.",
          price: 24.99,
          image: "/assets/male-model.png",
          category: "T-Shirts",
          tags: ["bollywood", "villain", "classic", "mogambo"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" }
          ],
          variants: [
            { id: "v1", title: "Black / S", price: 24.99, is_enabled: true },
            { id: "v2", title: "Black / M", price: 24.99, is_enabled: true }
          ]
        },
        {
          id: "2", 
          name: "Mere Paas Maa Hai Tee",
          description: "The ultimate emotional dialogue from Bollywood history - a tribute to mother's love and family values in iconic cinema.",
          price: 24.99,
          image: "/assets/female-model.png",
          category: "T-Shirts", 
          tags: ["bollywood", "emotional", "family", "classic"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Navy", hex: "#000080" },
            { name: "Gray", hex: "#808080" }
          ],
          variants: [
            { id: "v3", title: "Navy / S", price: 24.99, is_enabled: true },
            { id: "v4", title: "Navy / M", price: 24.99, is_enabled: true }
          ]
        },
        {
          id: "3",
          name: "Sholay Heroes Tribute",
          description: "Celebrate the friendship and heroism of Bollywood's greatest duo in this artistic tribute to the timeless classic Sholay.",
          price: 26.99,
          image: "/assets/male-model-2.png", 
          category: "T-Shirts",
          tags: ["sholay", "friendship", "heroes", "classic"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Maroon", hex: "#642838" },
            { name: "Forest", hex: "#223B26" }
          ],
          variants: [
            { id: "v5", title: "Maroon / S", price: 26.99, is_enabled: true },
            { id: "v6", title: "Maroon / M", price: 26.99, is_enabled: true }
          ]
        },
        {
          id: "4",
          name: "Vintage Cinema Magic",
          description: "A nostalgic design celebrating the golden age of Indian cinema with artistic elements and retro typography.",
          price: 28.99,
          image: "/assets/male-model-3.png",
          category: "T-Shirts",
          tags: ["vintage", "cinema", "retro", "golden-age"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Royal", hex: "#274D91" },
            { name: "Cherry Red", hex: "#A82235" }
          ],
          variants: [
            { id: "v7", title: "Royal / S", price: 28.99, is_enabled: true },
            { id: "v8", title: "Royal / M", price: 28.99, is_enabled: true }
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
      // Extract colors from variants
      const colorSet = new Set();
      const colorMap = {};
      
      product.variants?.forEach(variant => {
        if (variant.is_enabled && variant.options) {
          const colorOption = variant.options.find(opt => opt.type === 'color');
          if (colorOption) {
            colorSet.add(colorOption.value);
            if (!colorMap[colorOption.value]) {
              colorMap[colorOption.value] = colorOption.hex || '#000000';
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

      return {
        id: product.id,
        name: product.title,
        price: product.variants?.[0]?.price ? parseFloat(product.variants[0].price) / 100 : 24.99,
        image: firstImage,
        colors,
        variants: product.variants?.filter(v => v.is_enabled) || []
      };
    }) || [];

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