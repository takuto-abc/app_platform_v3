import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * 記事データを取得する関数
 * @returns {Promise<Array>} 記事の配列
 */
export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("記事の取得に失敗しました:", error);
    throw error;
  }
};

/**
 * プロジェクトデータを取得する関数
 * @returns {Promise<Array>} プロジェクトの配列
 */
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error("プロジェクトの取得に失敗しました:", error);
    throw error;
  }
};

/**
 * プロジェクトを作成する関数
 * @param {Object} project プロジェクトデータ
 * @returns {Promise<Object>} 作成されたプロジェクト
 */
export const createProject = async (project) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, project, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("プロジェクトの作成に失敗しました:", error);
    throw error;
  }
};
