import { Providers } from './providers';
import Header from './components/layout/header/page'; // ヘッダーコンポーネントのインポート
import Footer from './components/layout/footer/page'; // ヘッダーコンポーネントのインポート

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          {/* 共通のヘッダーを配置 */}
          <Header />
          {/* ページ固有のコンテンツ */}
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
