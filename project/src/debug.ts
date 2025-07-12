// Debug helper to test the API flow
export async function testAPIFlow() {
  console.log('[DEBUG] Testing API flow...')
  
  try {
    // Test 1: Raw fetch to Netlify function
    console.log('[DEBUG] Step 1: Testing raw fetch to Netlify function')
    const response = await fetch('/.netlify/functions/printify-products')
    console.log('[DEBUG] Response status:', response.status)
    console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await response.json()
    console.log('[DEBUG] Raw response data:', data)
    
    if (data.data && Array.isArray(data.data)) {
      console.log('[DEBUG] Found', data.data.length, 'products in API response')
      const firstProduct = data.data[0]
      console.log('[DEBUG] First product structure:', firstProduct)
      console.log('[DEBUG] First product images:', firstProduct?.images)
      console.log('[DEBUG] First product colors:', firstProduct?.colors)
    } else {
      console.error('[DEBUG] Data is not an array or missing data property')
    }
    
    // Test 2: Import and test the printify service
    console.log('[DEBUG] Step 2: Testing printify service')
    const { fetchPrintifyProducts } = await import('./services/printify')
    const products = await fetchPrintifyProducts()
    console.log('[DEBUG] Processed products:', products)
    
    // Test 3: Import and test the data products
    console.log('[DEBUG] Step 3: Testing data products')
    const { getFeaturedProducts } = await import('./data/products')
    const featured = await getFeaturedProducts()
    console.log('[DEBUG] Featured products:', featured)
    
    return { success: true, productsCount: featured.length }
  } catch (error) {
    console.error('[DEBUG] Error in API flow test:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
