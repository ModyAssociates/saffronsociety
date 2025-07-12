// netlify/functions/proxy-image.js
// Updated to use dynamic import for node-fetch ESM compatibility.

exports.handler = async (event) => {
  console.log('Proxy function called with query:', event.queryStringParameters);
  const { url } = event.queryStringParameters;

  if (!url) {
    console.error('Missing url parameter');
    return {
      statusCode: 400,
      body: 'Missing url parameter',
    };
  }

  try {
    const { default: fetch } = await import('node-fetch');  // Dynamic import for ESM
    console.log('Fetching image from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: 'Failed to proxy image',
    };
  }
};
