// netlify/functions/printify-products.js

exports.handler = async function (event) {
  console.log("▶️ printify-products handler starting. TOKEN:", process.env.PRINTIFY_API_TOKEN, "SHOP:", process.env.PRINTIFY_SHOP_ID);
    const token  = process.env.PRINTIFY_API_TOKEN;
    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!token || !shopId) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing env var' }),
      };
    }
  
    try {
      const res = await fetch(
        `https://api.printify.com/v1/shops/${shopId}/products.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      if (!res.ok) {
        const err = await res.text();
        return { statusCode: res.status, headers: { 'Access-Control-Allow-Origin': '*' }, body: err };
      }
      const payload = await res.json();
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(payload),
      };
    } catch (e) {
      return {
        statusCode: 502,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: e.message }),
      };
    }
  };
  