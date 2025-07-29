import { BlogPost } from '../pages/Blog';

// Fetch all blog posts from the Netlify function
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch('/.netlify/functions/blog-posts');
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

// Admin: Add a new blog post
export async function addBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
  const res = await fetch('/.netlify/functions/blog-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error('Failed to add blog post');
  return res.json();
}
