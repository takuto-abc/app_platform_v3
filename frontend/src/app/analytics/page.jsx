"use client";

import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import { fetchIconUsageRanking } from "../api/posts";

// ChartJS に必要なスケールと要素を登録
ChartJS.register(CategoryScale, LinearScale, BarElement);

const AnalyticsPage = () => {
  const [iconUsageData, setIconUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const data = await fetchIconUsageRanking();
        setIconUsageData(data);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" p={6}>
        <Spinner size="xl" />
        <Text mt={4}>データを読み込んでいます...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  // グラフ用のデータを整形
  const labels = iconUsageData.map((icon) => icon.name);
  const data = {
    labels,
    datasets: [
      {
        label: "アイコン使用回数",
        data: iconUsageData.map((icon) => icon.usage_count),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Y軸の最大値を5に設定
        ticks: {
          stepSize: 1, // 目盛の間隔を1に設定
        },
      },
    },
  };

  return (
    <Box p={6}>
      <Heading as="h1" size="lg" mb={4}>
        アイコン使用ランキング
      </Heading>
      {/* グラフ表示 */}
      <Box width="100%" maxWidth="800px" mx="auto" mb={8}>
        <Bar data={data} options={options} />
      </Box>

      {/* アイコンリスト表示 */}
      <Heading as="h2" size="md" mb={4}>
        使用されているアイコン
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
        {iconUsageData.map((icon) => (
          <Box
            key={icon.name}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            textAlign="center"
          >
            <Image
              src={icon.image_url}
              alt={icon.name}
              boxSize="48px"
              mx="auto"
              mb={2}
              objectFit="contain"
            />
            <Text fontSize="sm" fontWeight="bold">
              {icon.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              使用回数: {icon.usage_count}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsPage;
