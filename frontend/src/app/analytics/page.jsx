"use client"; // クライアントサイドコンポーネントとして設定

import React, { useEffect, useState, useRef } from "react";
import { Box, Heading, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { fetchIconUsageRanking } from "../api/posts";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Custom plugin to add icon images to x-axis labels
const IconLabelPlugin = {
  id: "iconLabel",
  beforeInit: async (chart) => {
    chart.iconImages = [];
  },
  afterInit: async (chart) => {
    const { images } = chart.options.plugins.iconLabel || {};
    if (!images || images.length === 0) return;

    // Load all images before initial render
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        
        // First try with the original URL
        const tryLoad = (url) => {
          img.onload = () => resolve(img);
          img.onerror = () => {
            // If original URL fails, try with a proxy service
            if (url === src) {
              const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;
              tryLoad(proxyUrl);
            } else {
              console.error(`画像の読み込みに失敗しました: ${src}`);
              resolve(null);
            }
          };
          img.src = url;
        };

        tryLoad(src);
      });
    };

    // 全ての画像を並行してロード
    const loadedImages = await Promise.all(images.map(loadImage));
    chart.iconImages = loadedImages;
    // chart.update('none'); 
  },
  afterDraw: (chart) => {
    const { ctx, scales: { x, y } } = chart;

    if (!chart.iconImages || chart.iconImages.length === 0) return;

    chart.iconImages.forEach((img, index) => {
      if (!img) return; // Skip if image failed to load

      const xValue = x.getPixelForTick(index);
      const imageSize = 30;
      const xPos = xValue - imageSize / 2;
      const yPos = y.getPixelForValue(0) + 10;

      try {
        ctx.drawImage(img, xPos, yPos, imageSize, imageSize);
      } catch (error) {
        console.error(`画像の描画に失敗しました: ${error.message}`);
      }
    });
  }
};

// Register the custom plugin along with other required scales and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  IconLabelPlugin
);

const AnalyticsPage = () => {
  const [iconUsageData, setIconUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // refを作成してBarコンポーネントに渡す

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const data = await fetchIconUsageRanking();
        console.log("取得したアイコンデータ:", data);
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

  useEffect(() => {
    // グラフの描画タイミングを調整するため、DOMが描画された後に処理を実行
    if (iconUsageData && chartRef.current) {
      chartRef.current.chartInstance?.update(); // グラフを更新
    }
  }, [iconUsageData]);

  if (loading) return <Box textAlign="center" p={6}><Text>データを読み込んでいます...</Text></Box>;
  if (error) return <Box textAlign="center" p={6}><Text color="red.500">{error}</Text></Box>;
  if (!iconUsageData || iconUsageData.length === 0) return <Box textAlign="center" p={6}><Text>表示するデータがありません。</Text></Box>;

  const labels = iconUsageData.map((icon) => icon.name);
  const data = {
    labels: labels,
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
    maintainAspectRatio: false, // アスペクト比を固定しない
    plugins: {
      title: {
        display: true,
        text: "アイコン使用ランキング",
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `使用回数: ${context.raw}`;
          },
        },
      },
      iconLabel: {
        images: iconUsageData.map((icon) => icon.image_url),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...iconUsageData.map((icon) => icon.usage_count)) + 1,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        bottom: 50, // アイコンのための余白を確保
      },
    },
  };

  return (
    <Box p={6}>
      <Heading as="h1" size="lg" mb={4}>
        アイコン使用ランキング
      </Heading>

      {/* 棒グラフ表示 - 高さを固定 */}
      <Box width="100%" maxWidth="800px" mx="auto" mb={8} height="400px">
        <Bar ref={chartRef} data={data} options={options} />
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
              onError={() => console.error(`画像の読み込みに失敗しました: ${icon.image_url}`)}
            />
            <Text fontSize="sm" fontWeight="bold">{icon.name}</Text>
            <Text fontSize="xs" color="gray.500">使用回数: {icon.usage_count}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsPage;
