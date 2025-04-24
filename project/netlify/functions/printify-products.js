// netlify/functions/printify-products.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const token  = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing PRINTIFY_API_TOKEN' }),
    };
  }
  if (!shopId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing PRINTIFY_SHOP_ID' }),
    };
  }

  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type':  'application/json',
          Accept:          'application/json',
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return {
        statusCode: res.status,
        body: errText,
      };
    }

    const payload = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    };

  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.toString() }),
    };
  }
};
