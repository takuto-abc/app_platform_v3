"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const Main = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // バックエンドAPIから記事データを取得
    axios.get(`${API_BASE_URL}/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('記事の取得に失敗しました:', error);
      });
  }, []);

  return (
    <main style={styles.main}>
      {posts.map((post) => (
        <article key={post.id} style={styles.article}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <Link href={`/posts/${post.id}`} style={styles.readMore}>続きを読む</Link>
        </article>
      ))}
    </main>
  );
};

const styles = {
  main: {
    padding: '40px',
    backgroundColor: '#ecf0f1',
    minHeight: '70vh',
  },
  article: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  readMore: {
    color: '#2980b9',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Main;
