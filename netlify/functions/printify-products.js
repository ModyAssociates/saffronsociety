// netlify/functions/printify-products.js
// Added logging for the raw API response and errors to debug empty/missing data.

exports.handler = async (event, context) => {
  const { PRINTIFY_API_TOKEN, PRINTIFY_SHOP_ID } = process.env;

  if (!PRINTIFY_API_TOKEN || !PRINTIFY_SHOP_ID) {
    console.log('Missing environment variables, returning mock data');
    // Return mock data for testing
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        data: [
          {
            id: "680bfba2fc5094250c0fcaf1",
            title: "Gabbar Singh Warning",
            description: "Classic T-shirt with iconic Gabbar Singh dialogue",
            images: [
              { src: "https://images.printify.com/mockup/680bfba2fc5094250c0fcaf1/88947/78606/gildan-unisex-ultra-cotton-tee.jpg?s=400&t=1729064867", is_default: true }
            ],
            variants: [
              { id: 1, price: 2599, is_enabled: true, options: { color: "Black", size: "S" } },
              { id: 2, price: 2599, is_enabled: true, options: { color: "White", size: "S" } },
              { id: 3, price: 2599, is_enabled: true, options: { color: "Navy", size: "M" } },
              { id: 4, price: 2599, is_enabled: true, options: { color: "Red", size: "L" } }
            ],
            tags: ["T-shirt"],
            colors: ["#000000", "#FFFFFF", "#1A2E5F", "#E3342F"] // Pre-mapped colors for mock data
          },
          // ... (add other mocks if needed for testing)
        ]
      })
    };
  }

  try {
    const response = await fetch(
      `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseBody = await response.text(); // Get raw text for logging
    console.log(`Printify API response status: ${response.status}`);
    console.log(`Printify API response body: ${responseBody.substring(0, 500)}...`); // Log first 500 chars to avoid huge logs

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${responseBody}`);
    }

    const data = JSON.parse(responseBody);
    
    // Process the data to extract colors
    const processedData = data.data.map(product => {
      // Extract color information from product options
      const colorOption = product.options?.find(opt => opt.type === 'color');
      let colors = [];
      
      if (colorOption && colorOption.values) {
        // Printify provides hex colors directly in the colors array
        colors = colorOption.values
          .filter(v => v.colors && v.colors.length > 0)
          .map(v => v.colors[0]) // Get the first hex color from each value
          .filter(Boolean); // Remove any undefined/null values
        
        console.log(`Product: ${product.title}`);
        console.log(`Color option found:`, colorOption);
        console.log(`Extracted colors:`, colors);
      } else {
        console.log(`Product: ${product.title} - No color option found`);
        console.log(`Available options:`, product.options?.map(o => o.type));
      }
      
      return {
        ...product,
        colors: colors
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ data: processedData }),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch products' }),
    };
  }
};