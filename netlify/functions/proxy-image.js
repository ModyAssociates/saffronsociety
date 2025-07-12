// ESM format matching project guidelines

export default async (req, context) => {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('url');
  
  console.log('Proxy function called with URL:', imageUrl);

  if (!imageUrl) {
    console.error('Missing url parameter');
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    console.log('Fetching image from:', imageUrl);
    const response = await fetch(decodeURIComponent(imageUrl));
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Failed to proxy image', { status: 500 });
  }
};

export const config = {
  path: "/api/proxy-image"
};