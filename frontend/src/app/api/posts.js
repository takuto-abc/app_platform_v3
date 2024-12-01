// frontend/src/app/api/posts.js

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * 記事データを取得する関数
 * @returns {Promise<Array>} 記事の配列
 */
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('記事の取得に失敗しました:', error);
    throw error;
  }
};
