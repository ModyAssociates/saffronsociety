import React, { useState } from 'react';
import { addBlogPost } from '../services/blog';
import { useAuth } from '../context/AuthContext';

interface BlogPostAdminProps {
  onSuccess?: () => void;
}


const TABS = [
  { key: 'rich', label: 'Write' },
  { key: 'html', label: 'HTML' },
];

const BlogPostAdmin: React.FC = () => {
  const { profile } = useAuth();
  const [tab, setTab] = useState<'rich' | 'html'>('rich');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogHtml, setBlogHtml] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogError(null);
    setBlogSuccess(null);
    setBlogLoading(true);
    try {
      const content = tab === 'html' ? blogHtml : blogContent.replace(/\n/g, '<br />');
      if (!blogTitle.trim() || !content.trim()) {
        setBlogError('Title and content are required.');
        setBlogLoading(false);
        return;
      }
      await addBlogPost({
        title: blogTitle,
        content,
        author: profile?.full_name || 'Admin',
        coverImage,
      });
      setBlogTitle('');
      setBlogContent('');
      setBlogHtml('');
      setCoverImage('');
      setBlogSuccess('Blog post added!');
    } catch (err) {
      setBlogError('Failed to add blog post.');
    } finally {
      setBlogLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Add Blog Post</h2>
      <form onSubmit={handleBlogSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={blogTitle}
            onChange={e => setBlogTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL (optional)</label>
          <input
            type="text"
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
        <div>
          <div className="flex gap-2 mb-2">
            {TABS.map(t => (
              <button
                key={t.key}
                type="button"
                className={`px-3 py-1 rounded-t-md border-b-2 font-medium ${tab === t.key ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 bg-gray-100'}`}
                onClick={() => setTab(t.key as 'rich' | 'html')}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'rich' ? (
            <textarea
              value={blogContent}
              onChange={e => setBlogContent(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Write your post..."
              required={tab === 'rich'}
            />
          ) : (
            <textarea
              value={blogHtml}
              onChange={e => setBlogHtml(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Paste or write HTML code..."
              required={tab === 'html'}
            />
          )}
        </div>
        {blogError && <div className="text-red-500 text-sm">{blogError}</div>}
        {blogSuccess && <div className="text-green-600 text-sm">{blogSuccess}</div>}
        <button
          type="submit"
          disabled={blogLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition disabled:opacity-60"
        >
          {blogLoading ? 'Adding...' : 'Add Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogPostAdmin;
