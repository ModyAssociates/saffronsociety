# Saffron Society - Setup Guide

## Authentication & Order System Setup

This guide will help you set up the complete authentication and order fulfillment system with Supabase and Printify integration.

### Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Printify Account**: Create an account at [printify.com](https://printify.com)
3. **Social OAuth Apps**: Set up Google and Facebook apps for social login

### 1. Supabase Setup

#### Create a New Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a database password and region
3. Wait for the project to be created

#### Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Configure Site URL: `https://your-site.netlify.app` (or your domain)
3. Add redirect URLs:
   - `https://your-site.netlify.app/**`
   - `http://localhost:3000/**` (for local development)

#### Set Up Social Providers

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase Auth settings

**Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Copy App ID and App Secret to Supabase Auth settings

#### Database Schema
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create tables and policies
4. After signing up with your admin email, update your role:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 2. Printify Setup

#### Get API Credentials
1. Go to [Printify](https://printify.com) and log in
2. Navigate to My Account > Connections > API
3. Generate a Personal Access Token
4. Note your Shop ID (found in the shop settings)

#### Connect Products
1. Ensure your products are published in Printify
2. Note the product IDs and variant IDs for mapping

### 3. Environment Variables

#### For Netlify Functions (Root `.env`)
Create a `.env` file in the root directory:
```bash
PRINTIFY_API_TOKEN=your_printify_personal_access_token
PRINTIFY_SHOP_ID=your_printify_shop_id
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### For Frontend (project/.env)
Create a `.env` file in the `project` directory:
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### For Netlify Deployment
In your Netlify dashboard, go to Site Settings > Environment Variables and add:
- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Local Development

1. Install dependencies:
   ```bash
   cd project
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test Netlify functions locally:
   ```bash
   cd ..
   netlify dev
   ```

### 5. Product Mapping

Update `src/data/products.ts` to include the correct Printify product and variant IDs:

```typescript
export const products: Product[] = [
  {
    id: 'shirt-1',
    printifyProductId: '123456789', // Your actual Printify product ID
    variants: [
      {
        id: 'shirt-1-s-black',
        printifyVariantId: 987654321, // Your actual variant ID
        size: 'S',
        color: 'Black',
        // ...
      }
    ]
  }
];
```

### 6. Testing the System

1. **Authentication**: Test signup/login with email and social providers
2. **User Flow**: Add items to cart, proceed to checkout
3. **Admin Panel**: Access `/admin` with admin account to view orders
4. **Order Fulfillment**: Test order creation and Printify submission

### 7. Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify
4. Deploy and test on production

### Troubleshooting

#### Common Issues

1. **Supabase Connection Error**: Check URL and keys in environment variables
2. **Social Login Not Working**: Verify redirect URLs and OAuth app configuration
3. **Printify Orders Failing**: Check API token and shop ID
4. **Admin Panel Not Loading**: Ensure user role is set to 'admin' in database

#### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoints manually
4. Check Supabase logs for database errors
5. Verify Printify API responses

### Security Notes

- Never commit `.env` files to version control
- Use Row Level Security (RLS) policies for data protection
- Regularly rotate API keys
- Monitor for suspicious activity in admin panel

### Support

For issues with this setup, check:
1. Supabase documentation
2. Printify API documentation
3. Netlify functions documentation

---

## Features Included

✅ **Authentication System**
- Email/password signup and login
- Google OAuth integration
- Facebook OAuth integration
- User profile management
- Role-based access control (user/admin)

✅ **Order Management**
- Shopping cart functionality
- Secure checkout process
- Order tracking and status updates
- Admin dashboard for order management

✅ **Printify Integration**
- Automatic order submission to Printify
- Product and variant mapping
- Order status synchronization

✅ **Security Features**
- Row Level Security (RLS) policies
- Secure API endpoints
- Input validation and sanitization
- Protected admin routes
