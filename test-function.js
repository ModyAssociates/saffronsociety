// Test the printify-products function locally
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Import the function
const { handler } = require('./netlify/functions/printify-products.js');

async function test() {
  console.log('Testing printify-products function...');
  console.log('TOKEN exists:', !!process.env.PRINTIFY_API_TOKEN);
  console.log('SHOP_ID exists:', !!process.env.PRINTIFY_SHOP_ID);
  
  try {
    const result = await handler({});
    const data = JSON.parse(result.body);
    
    console.log('Status Code:', result.statusCode);
    console.log('Number of products:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      const firstProduct = data.data[0];
      console.log('\nFirst product:');
      console.log('- ID:', firstProduct.id);
      console.log('- Title:', firstProduct.title);
      console.log('- Colors:', firstProduct.colors);
      console.log('- Number of colors:', firstProduct.colors?.length || 0);
      
      // Check if we have options data
      if (firstProduct.options) {
        const colorOption = firstProduct.options.find(opt => opt.type === 'color');
        if (colorOption) {
          console.log('\nColor option found:');
          console.log('- Values count:', colorOption.values?.length || 0);
          if (colorOption.values && colorOption.values.length > 0) {
            console.log('- First color value:', colorOption.values[0]);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
