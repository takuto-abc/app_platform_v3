'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // URL パラメータの取得
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { fetchBlocks, fetchIcons } from '../../api/posts'; // API呼び出し関数をインポート

const ProjectDetailPage = () => {
  const { id } = useParams(); // URLパラメータからプロジェクトIDを取得
  const [blocks, setBlocks] = useState([]);
  const [blockIconsMap, setBlockIconsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // ブロックデータの取得
        const blocksData = await fetchBlocks(id);
        setBlocks(blocksData);

        // 各ブロックに対応するアイコンデータの取得
        const iconsDataPromises = blocksData.map((block) =>
          fetchIcons(block.id).then((icons) => ({
            blockId: block.id,
            icons,
          }))
        );

        const iconsDataResults = await Promise.all(iconsDataPromises);

        // アイコンデータをブロックIDごとにマッピング
        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex height="100vh" direction="column" bg="gray.100">
      {/* ヘッダー */}
      <Box bg="teal.500" color="white" py={4} px={8}>
        <Heading size="lg">プロジェクト詳細: {id}</Heading>
      </Box>

      {/* メインコンテンツ */}
      <Box flex="1" p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="md" mb={4}>
            ブロック一覧
          </Heading>
          {blocks.length === 0 ? (
            <Text color="gray.500">ブロックがありません。</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {blocks.map((block) => (
                <Box
                  key={block.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="white"
                  boxShadow="sm"
                >
                  <Heading size="sm" mb={2}>
                    {block.tag_name}
                  </Heading>
                  <SimpleGrid columns={2} spacing={2}>
                    {blockIconsMap[block.id]?.map((icon) => (
                      <Box
                        key={icon.id}
                        p={2}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="gray.50"
                        boxShadow="sm"
                        textAlign="center"
                      >
                        <img
                          src={icon.image_url}
                          alt={icon.name}
                          style={{ width: '100%', height: '50px', objectFit: 'contain' }}
                        />
                        <Text mt={2} fontSize="sm">
                          {icon.name}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Box>

      {/* フッター */}
      <Box bg="teal.500" color="white" py={4} textAlign="center">
        <Text>© 2024 takutosan.</Text>
      </Box>
    </Flex>
  );
};

export default ProjectDetailPage;
