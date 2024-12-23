import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";


// Project ------------------------------------------------------------------------


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
 * プロジェクトを作成し、オプションでブロックやアイコンも追加する関数
 * @param {Object} project プロジェクトデータ
 * @param {Array<Object>} [blocks=[]] 関連付けるブロックのデータ
 * @param {Array<Object>} [iconsMap={}] 各ブロックに関連付けるアイコンのデータ
 * @returns {Promise<Object>} 作成されたプロジェクト
 */
export const createProject = async (project, blocks = [], iconsMap = {}) => {
  try {
    // プロジェクトを作成
    const response = await axios.post(`${API_BASE_URL}/projects`, project, {
      headers: { "Content-Type": "application/json" },
    });
    const createdProject = response.data;

    // ブロックとアイコンを追加
    for (const block of blocks) {
      const blockResponse = await axios.post(
        `${API_BASE_URL}/projects/${createdProject.id}/blocks`,
        block,
        { headers: { "Content-Type": "application/json" } }
      );
      const createdBlock = blockResponse.data;

      if (iconsMap[block.tag_name]) {
        for (const icon of iconsMap[block.tag_name]) {
          await axios.post(
            `${API_BASE_URL}/blocks/${createdBlock.id}/icons`,
            icon,
            { headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    return createdProject;
  } catch (error) {
    console.error("プロジェクトの作成に失敗しました:", error);
    throw error;
  }
};


/**
 * プロジェクトを更新する関数
 * @param {number} projectId - プロジェクトID
 * @param {Object} projectData - 更新するプロジェクトのデータ
 * @returns {Promise<Object>} - 更新されたプロジェクトデータ
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/projects/${projectId}`,
      projectData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`プロジェクト ${projectId} の更新に失敗しました:`, error);
    throw error;
  }
};


/**
 * プロジェクトを削除する関数
 * @param {number} projectId プロジェクトID
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/projects/${projectId}`);
    console.log("プロジェクト削除成功:", response.data); // デバッグログ
    return response.data;
  } catch (error) {
    console.error("プロジェクト削除API呼び出しに失敗:", error.response?.data || error.message || error);
    throw error;
  }
};


// Block ------------------------------------------------------------------------



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
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/blocks`,
      block,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(`プロジェクト ${projectId} にブロックを追加するのに失敗しました:`, error);
    throw error;
  }
};


/**
 * ブロックを削除する関数
 * @param {number} blockId ブロックID
 * @returns {Promise<Object>} 削除されたブロックデータ
 */
export const deleteBlock = async (projectId, blockId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/projects/${projectId}/blocks/${blockId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("削除されたブロックデータ:", response.data);
    return response.data;
  } catch (error) {
    console.error("ブロック削除リクエストでエラーが発生しました:", error);
    throw error;
  }
};




// Icon ------------------------------------------------------------------------


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
    console.warn(`ブロック ${blockId} のアイコン取得に失敗しました:`, error);
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


/**
 * 特定のアイコンを論理削除する関数
 * @param {number} blockId ブロックID
 * @param {number} iconId アイコンID
 * @returns {Promise<Object>} 削除されたアイコンデータ
 */
export const deleteIcon = async (blockId, iconId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/blocks/${blockId}/icons/${iconId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("削除されたアイコンデータ:", response.data);
    return response.data;
  } catch (error) {
    console.error("アイコン削除リクエストでエラーが発生しました:", {
      message: error.message,
      response: error.response?.data || "レスポンスなし",
      status: error.response?.status || "ステータスなし",
    });
    throw error;
  }
};


/**
 * アイコンが存在するか確認する関数
 * @param {string} iconName アイコン名
 * @returns {Promise<Object>} アイコンデータ or エラーメッセージ
 */
export const validateIcon = async (iconName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/icons/validate?name=${iconName}`);
    return response.data; // 候補アイコンのリストを返す
  } catch (error) {
    console.warn("アイコン候補の検証に失敗しました:", error);
    throw error;
  }
};

/**
 * アイコン使用回数のランキングを取得する関数
 * @returns {Promise<Array>} アイコンのランキングデータ
 */
export const fetchIconUsageRanking = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/icon-usage`);
    return response.data;
  } catch (error) {
    console.error("アイコン使用ランキングの取得に失敗しました:", error);
    throw error;
  }
};