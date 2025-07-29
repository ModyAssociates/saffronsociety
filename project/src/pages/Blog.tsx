import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../services/blog';
import { Link } from 'react-router-dom';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  coverImage?: string;
}

const BlogPage: React.FC = () => {

  // All hooks at the top
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const handleLoadMore = () => setVisibleCount(c => c + 8);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load blog posts.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading blog posts...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.length === 0 ? (
        <div className="text-gray-500">No blog posts yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.slice(0, visibleCount).map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-lg shadow p-0 flex flex-col overflow-hidden hover:shadow-lg transition group"
              >
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      style={{ maxWidth: 500, maxHeight: 500 }}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-center">{post.title}</h2>
                </div>
              </Link>
            ))}
          </div>
          {visibleCount < posts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
