// frontend/src/app/api/useFetchPosts.js

import { useState, useEffect } from 'react';
import { fetchPosts } from './posts';

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  return { posts, loading, error };
};

export default useFetchPosts;
