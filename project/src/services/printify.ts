const PRINTIFY_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjA0MWE2Y2YxMjRhYjkyZjMwNWJiOGFjMThkYWJlMTNiZGFlOTU1MTY5YzFkZmE2YmUxZmY1ZDYwNDgzYmM5YTNlYTljNDFhODk3ODBlMjcwIiwiaWF0IjoxNzQ1NDcyMTc1LjQ1MDM4MywibmJmIjoxNzQ1NDcyMTc1LjQ1MDM4NSwiZXhwIjoxNzc3MDA4MTc1LjQ0MDc0Nywic3ViIjoiOTg4MzgxNSIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiLCJ1c2VyLmluZm8iXX0.tyOkPPZKY4wK1JeVAzzQkaTdUx2nAmq9aT2MITlta1JaeWPEF6m3e3p1JRjkiSTRRtaGDkyyOut1iFAn1Vloac1w7dSEcaQKPh2P3EVPrS2ErQBado3nNHR64EMbj1f79MtnZ5M8pKaet5ghQZDPSo0nzsTlDtvgZrpWzcXcwft7oem248_R7DNlyF6OQ-io8wkI-8F1-UD2v1Cz8NkO3ShO2OAUSf5uh1zkOBtOxbu4v--tjAiT4DByaYFdbpRm-3hulC1KNq28rkiao3kF-aQeNIfNRKYhVRw-1mc0chSnNoiK08QgGU-dzgaSOAP5aRxxllShez0ofS84ffvHMSgdFZlejQlMn2LtFUwUDmSvbHi_EputoNl4yuIMu_ci4yrXqZuqtC8JrpgQCEV_F6DaRO556P4YQOPCAQjVxvc7yZ0mNCdOck0pi96dIDv69SmVzLV-rSdP1zYJM9ivG6MFIJoh1PLO8HZ-KNNr3Ty73wmcic6DROeB8_WHDFVEPS9fBx2cbA0cbnrvFBgGI18bj8x22P7_j_v0XiRK1kYxpB8pavE6RYiyjgyxAcfoJr_GJxbjHynDPG2zso9WjvJAjUdJ-e1Gxvse4RRLuTixjFif2XEv57HarRvufMR3b-wzQVYk0X3m146eUFp-KX0Kuf4PmOdQ1QAYTFZWeFI';
const API_URL = 'https://api.printify.com/v1';

interface PrintifyImage {
  src: string;
  is_default: boolean;
}

interface PrintifyVariant {
  id: number;
  price: number;
  is_enabled: boolean;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  tags: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const headers = {
  'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

async function getShopId(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/shops.json`, {
      headers,
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No shops found in response');
    }

    const shopId = data[0]?.id?.toString();
    if (!shopId) {
      throw new Error('Invalid shop ID in response');
    }

    return shopId;
  } catch (error) {
    console.error('Error fetching shop ID:', error);
    throw error; // Re-throw to handle it in the calling function
  }
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  try {
    const shopId = await getShopId();

    const response = await fetch(`${API_URL}/shops/${shopId}/products.json`, {
      headers,
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid products response format');
    }

    return data.data.map((product: PrintifyProduct) => {
      const defaultImage = product.images.find(img => img.is_default) || product.images[0];
      const activeVariant = product.variants.find(v => v.is_enabled) || product.variants[0];
      const category = product.tags?.[0]?.toLowerCase() || 'classics';

      return {
        id: product.id,
        name: product.title,
        description: product.description || 'Vintage Bollywood T-Shirt',
        price: activeVariant?.price || 29.99,
        image: defaultImage?.src || '/placeholder.jpg',
        category
      };
    });
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    throw error; // Re-throw the error to handle it in the UI
  }
}