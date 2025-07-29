// Netlify Function: blog-posts.js
// Handles GET (list) and POST (add) for blog posts
// Uses Netlify's built-in environment and file system for demo; replace with DB in production

const fs = require('fs');
const path = require('path');

const BLOG_FILE = path.join(__dirname, 'blog-posts.json');

function readPosts() {
  if (!fs.existsSync(BLOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(BLOG_FILE, 'utf-8'));
}

function writePosts(posts) {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
}

exports.handler = async function(event) {
  if (event.httpMethod === 'GET') {
    // List all posts
    return {
      statusCode: 200,
      body: JSON.stringify(readPosts()),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  if (event.httpMethod === 'POST') {
    // Add a new post (admin only; add real auth in production)
    const { title, content, author, coverImage } = JSON.parse(event.body || '{}');
    if (!title || !content || !author || !coverImage) {
      return { statusCode: 400, body: 'Missing fields' };
    }
    const posts = readPosts();
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      author,
      coverImage,
      created_at: new Date().toISOString(),
    };
    posts.unshift(newPost);
    writePosts(posts);
    return {
      statusCode: 201,
      body: JSON.stringify(newPost),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
