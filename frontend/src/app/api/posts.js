import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

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

/**
 * 特定のプロジェクトに紐づくブロックを取得する関数
 * @param {number} projectId プロジェクトID
 * @returns {Promise<Array>} ブロックの配列
 */
export const fetchBlocks = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/blocks`);
    return response.data;
  } catch (error) {
    console.error(`プロジェクト ${projectId} のブロック取得に失敗しました:`, error);
    throw error;
  }
};

/**
 * 特定のプロジェクトにブロックを追加する関数
 * @param {number} projectId プロジェクトID
 * @param {Object} block ブロックデータ
 * @returns {Promise<Object>} 作成されたブロック
 */
export const createBlock = async (projectId, block) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/blocks`, block, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`プロジェクト ${projectId} にブロックを追加するのに失敗しました:`, error);
    throw error;
  }
};

/**
 * 特定のブロックに紐づくアイコンを取得する関数
 * @param {number} blockId ブロックID
 * @returns {Promise<Array>} アイコンの配列
 */
export const fetchIcons = async (blockId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blocks/${blockId}/icons`);
    return response.data;
  } catch (error) {
    console.error(`ブロック ${blockId} のアイコン取得に失敗しました:`, error);
    throw error;
  }
};

/**
 * 特定のブロックにアイコンを追加する関数
 * @param {number} blockId ブロックID
 * @param {Object} icon アイコンデータ
 * @returns {Promise<Object>} 作成されたアイコン
 */
export const createIcon = async (blockId, icon) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/blocks/${blockId}/icons`, icon, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`ブロック ${blockId} にアイコンを追加するのに失敗しました:`, error);
    throw error;
  }
};
