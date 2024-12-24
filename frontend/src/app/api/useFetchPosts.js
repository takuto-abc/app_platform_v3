import { useState, useEffect, useCallback } from "react";
import { fetchProjects, fetchBlocks, fetchIcons } from "./posts";

/**
 * データ取得用カスタムフック
 * @param {"projects" | "blocks" | "icons"} type 取得するデータの種類
 * @param {number} [parentId] 親要素のID (プロジェクトIDやブロックID)
 * @returns {Object} データ、ローディング状態、エラー、再取得関数を返却
 */
const useFetchData = (type, parentId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // エラー状態をリセット

    try {
      let response;

      if (type === "projects") {
        response = await fetchProjects();
      } else if (type === "blocks") {
        if (!parentId) throw new Error("Parent ID is required for fetching blocks");
        response = await fetchBlocks(parentId);
      } else if (type === "icons") {
        if (!parentId) throw new Error("Parent ID is required for fetching icons");
        response = await fetchIcons(parentId);
      } else {
        throw new Error("Unsupported fetch type");
      }

      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [type, parentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
