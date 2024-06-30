import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Utilisation de require.context pour importer les fichiers dynamiquement
      const context = require.context('../posts', false, /\.md$/);
      const postFiles = context.keys().map(context);

      const postsData = await Promise.all(
        postFiles.map(async (file) => {
          const response = await fetch(file);
          const text = await response.text();
          const { data, content } = matter(text);
          return { ...data, content };
        })
      );

      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blog Posts</h1>
      </header>
      <main>
        {posts.map((post, index) => (
          <article key={index}>
            <h2>{post.title}</h2>
            <p>{typeof post.date === 'string' ? post.date : post.date.toString()}</p>
            {/* <img src={post.thumbnail} alt={post.title} /> */}
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
        ))}
      </main>
    </div>
  );
}

export default App;
