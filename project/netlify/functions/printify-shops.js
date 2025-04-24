// netlify/functions/printify-shops.js

exports.handler = async (event) => {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing PRINTIFY_API_TOKEN' }),
    };
  }

  try {
    const shopRes = await fetch('https://api.printify.com/v1/shops.json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!shopRes.ok) {
      const errText = await shopRes.text();
      return {
        statusCode: shopRes.status,
        body: errText,
      };
    }

    const shops = await shopRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(shops),
    };

  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.toString() }),
    };
  }
};
