import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase. We'll send you an email confirmation shortly.</p>
        </div>

        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-sm">{orderId.slice(0, 8)}...</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Package className="w-5 h-5" />
            <span className="text-sm">Your order is being processed and will be shipped soon</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/account')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View Account
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
