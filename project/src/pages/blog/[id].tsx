import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogPosts } from '../../services/blog';

const BlogPostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts()
      .then(posts => {
        const found = posts.find((p: any) => p.id === id);
        if (!found) {
          setError('Blog post not found.');
        } else {
          setPost(found);
        }
      })
      .catch(() => setError('Failed to load blog post.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/blog" className="text-orange-500 hover:underline mb-4 inline-block">← Back to Blog</Link>
      <div className="w-full flex items-center justify-center mb-6">
        <div className="bg-gray-200 relative" style={{ width: 500, height: 500 }}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover rounded"
              style={{ width: 500, height: 500 }}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gray-400" style={{ width: 500, height: 500 }}>No Image</span>
          )}
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-xs text-gray-400 mb-4">
        By {post.author} • {new Date(post.created_at).toLocaleDateString()}
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostDetails;
