'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { fetchBlocks, fetchIcons } from '../../api/posts';
import { useParams } from 'next/navigation';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const ProjectDetailPage = () => {
  const params = useParams();
  const [blocks, setBlocks] = useState([]);
  const [blockIconsMap, setBlockIconsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const projectId = params?.id;

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      setLoading(true);

      try {
        const blocksData = await fetchBlocks(projectId);
        setBlocks(blocksData);

        const iconsDataPromises = blocksData.map((block) =>
          fetchIcons(block.id)
            .then((icons) => ({ blockId: block.id, icons }))
            .catch(() => ({ blockId: block.id, icons: [] }))
        );

        const iconsDataResults = await Promise.all(iconsDataPromises);

        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleIconClick = (icon) => {
    if (selectedIcon?.id === icon.id) {
      setSelectedIcon(null);
    } else {
      setSelectedIcon(icon);
    }
  };

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center" bg="gray.900">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Flex height="100vh" bg="gray.900" overflow="hidden" position="relative">
      {/* メインコンテンツ */}
      <Box as="main" flex="1" p={6} bg="gray.900" overflowY="auto" color="white">
        <Heading mb={4} color="white">
          プロジェクト詳細
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {blocks.map((block) => (
            <Box
              key={block.id}
              p={4}
              borderRadius="md"
              boxShadow="sm"
              bg="gray.800" // 背景色をさらに暗く設定
              _hover={{ bg: 'gray.700' }} // ホバー時も暗め
              transition="background-color 0.2s"
            >
              <Heading as="h3" size="md" mb={2} color="white">
                {block.tag_name}
              </Heading>
              <Text color="gray.400">ブロックID: {block.id}</Text>
              <Text color="gray.400">
                関連アイコン数: {blockIconsMap[block.id]?.length || 0}
              </Text>

              <SimpleGrid columns={2} spacing={2} mt={4}>
                {blockIconsMap[block.id]?.map((icon) => (
                  <Box
                    key={icon.id}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => handleIconClick(icon)}
                    bg={selectedIcon?.id === icon.id ? 'teal.300' : 'gray.700'} // 非選択時の色を暗めに
                    transition="background-color 0.2s"
                  >
                    <img
                      src={icon.image_url}
                      alt={icon.name}
                      style={{ width: '50px', height: '50px', margin: '0 auto' }}
                    />
                    <Text mt={2} fontSize="sm" color="white" noOfLines={1}>
                      {icon.name}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* 右サイドバー */}
      {selectedIcon && (
        <Box
          position="absolute"
          top="0"
          right="0"
          width="300px"
          height="100vh"
          bg="gray.800"
          borderLeft="1px solid #e2e8f0"
          boxShadow="lg"
          p={4}
          zIndex="20"
          display="flex"
          flexDirection="column"
          color="white"
        >
          <Flex justify="flex-start" mb={4}>
            <Button
              variant="ghost"
              onClick={() => setSelectedIcon(null)}
              bg="transparent"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'gray.700' }}
              width="32px"
              height="32px"
              p={0}
              minWidth="32px"
              fontSize="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <ChevronLeftIcon boxSize="1.5em" />
            </Button>
          </Flex>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={selectedIcon.image_url}
              alt={selectedIcon.name}
              style={{ width: '100px', height: '100px', marginBottom: '16px' }}
            />
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {selectedIcon.name}
            </Text>
            <Text color="gray.400">アイコンID: {selectedIcon.id}</Text>
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default ProjectDetailPage;
