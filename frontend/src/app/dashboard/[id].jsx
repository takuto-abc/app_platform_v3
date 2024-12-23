'use client';

import { useRouter } from 'next/navigation';

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // 動的パラメータを取得

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>プロジェクト詳細ページ</h1>
      <p>プロジェクトID: {id}</p>
    </div>
  );
};

export default ProjectDetailPage;
