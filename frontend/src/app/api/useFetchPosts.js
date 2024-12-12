import { useState, useEffect } from "react";
import { fetchPosts, fetchProjects } from "./posts";

/**
 * データ取得用カスタムフック
 * @param {"posts" | "projects"} type 取得するデータの種類
 * @returns {Object} データ、ローディング状態、エラーを返却
 */
const useFetchData = (type) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (type === "posts") {
          response = await fetchPosts();
        } else if (type === "projects") {
          response = await fetchProjects();
        } else {
          throw new Error("Unsupported fetch type");
        }
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return { data, loading, error };
};

export default useFetchData;
