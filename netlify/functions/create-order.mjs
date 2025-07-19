import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for server-side
)

export default async (req, context) => {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { items, shippingAddress, paymentInfo } = await req.json()
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total,
        items,
        shipping_address: shippingAddress,
        payment_info: {
          method: paymentInfo.method,
          last4: paymentInfo.last4
        }
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order in Printify
    const printifyItems = await Promise.all(items.map(async (item) => {
      // Get variant ID based on size and color
      const variantResponse = await fetch(
        `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products/${item.id}.json`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`
          }
        }
      )
      
      const productData = await variantResponse.json()
      const variant = productData.variants.find(v => 
        v.title.includes(item.selectedSize) && 
        v.options.some(opt => opt.value === item.selectedColor)
      )

      return {
        product_id: item.id,
        variant_id: variant?.id || productData.variants[0].id,
        quantity: item.quantity
      }
    }))

    const printifyResponse = await fetch(
      `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_items: printifyItems,
          shipping_address: {
            first_name: shippingAddress.firstName,
            last_name: shippingAddress.lastName,
            email: user.email,
            phone: shippingAddress.phone,
            country: shippingAddress.country,
            region: shippingAddress.state,
            address1: shippingAddress.address1,
            address2: shippingAddress.address2 || '',
            city: shippingAddress.city,
            zip: shippingAddress.zip
          },
          send_shipping_notification: true
        })
      }
    )

    if (!printifyResponse.ok) {
      const error = await printifyResponse.text()
      console.error('Printify error:', error)
      throw new Error('Failed to create Printify order')
    }

    const printifyOrder = await printifyResponse.json()

    // Update order with Printify ID
    await supabase
      .from('orders')
      .update({ 
        printify_order_id: printifyOrder.id,
        status: 'processing'
      })
      .eq('id', order.id)

    // Submit order for production
    await fetch(
      `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${printifyOrder.id}/submit.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`
        }
      }
    )

    return new Response(JSON.stringify({ 
      success: true,
      orderId: order.id,
      printifyOrderId: printifyOrder.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to create order',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  path: "/api/create-order"
}
