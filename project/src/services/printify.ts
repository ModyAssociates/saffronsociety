// project/src/services/printify.ts
interface PrintifyVariant { 
  id: number; price: number; is_enabled: boolean;
  option1?: string;
}
interface PrintifyProduct { /* … */ }

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  colors: string[];   // ← make sure this line is present
}

export async function fetchPrintifyProducts(): Promise<Product[]> {
  // 1) pull the shop list
  const shopRes = await fetch(`${API_URL}/shops/${shopId}/products.json`, { headers });
  const { data } = await shopRes.json() as { data: PrintifyProduct[] };

  return Promise.all(
    data.map(async (p) => {
      // 2) for each product, fetch its full detail
      const detailRes = await fetch(`${API_URL}/shops/${shopId}/products/${p.id}.json`, { headers });
      const detail   = await detailRes.json() as { variants: PrintifyVariant[] };

      // 3) extract unique color names from option1
      const colorNames = [...new Set(
        detail.variants
          .filter((v) => v.is_enabled)
          .map((v) => v.option1 || "Unknown")
      )];

      // 4) map names to hex codes
      const colors = colorNames.map((name) => COLOR_HEX[name] || "#CCCCCC");

      // 5) lowest enabled‐variant logic (in dollars)
      const prices = detail.variants
        .filter((v) => v.is_enabled)
        .map((v) => Number(v.price) / 100);
      const price  = prices.length ? Math.min(...prices) : 29.99;

      // …pick default image & other fields as before…
      return {
        id:       p.id,
        name:     p.title,
        price,
        image:    /*…*/,
        category: /*…*/,
        colors,
      };
    })
  );
}
