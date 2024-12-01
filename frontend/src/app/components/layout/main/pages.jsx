// frontend/src/app/components/ui/Main.jsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Dashboard from '.../ui/Dashboard';
import EditScreen from '.../ui/EditScreen';
import Button from '.../ui/Button';
import useFetchPosts from '..../api/useFetchPosts'; // カスタムフックのインポート

const Main = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' または 'edit'
  const { posts, loading, error } = useFetchPosts();

  return (
    <div>
      <header className="header">
        <Button
          active={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        >
          ダッシュボード
        </Button>
        <Button
          active={currentView === 'edit'}
          onClick={() => setCurrentView('edit')}
        >
          編集
        </Button>
      </header>
      <main className="main">
        {currentView === 'dashboard' ? <Dashboard /> : <EditScreen />}

        {/* ダッシュボード画面に記事一覧を表示 */}
        {currentView === 'dashboard' && (
          <div>
            {loading && <p>読み込み中...</p>}
            {error && <p style={{ color: 'red' }}>記事の取得に失敗しました。</p>}
            {posts.map((post) => (
              <article key={post.id} className="article">
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link href={`/posts/${post.id}`} className="readMore">
                  続きを読む
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;
