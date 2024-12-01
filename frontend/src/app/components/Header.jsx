// Header.jsx
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        {/* ロゴやサイト名をここに配置 */}
        <h1>My Blog</h1>
      </div>
      <nav style={styles.nav}>
        {/* ナビゲーションメニュー */}
        <a href="/">ホーム</a>
        <a href="/about">私について</a>
        <a href="/contact">お問い合わせ</a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    marginLeft: '20px',
  },
  nav: {
    marginRight: '20px',
  },
};

export default Header;
