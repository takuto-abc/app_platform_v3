"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Button,
  VStack,
  Text,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { fetchBlocks, fetchIcons } from "../api/posts";
import useFetchData from "../api/useFetchPosts"; // カスタムフックをインポート

const DashboardPage = () => {
  const { data: projects, loading, error } = useFetchData("projects");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [blockIconsMap, setBlockIconsMap] = useState({});

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!selectedProjectId) return;
      setLoadingBlocks(true);
      try {
        const blocksData = await fetchBlocks(selectedProjectId);
        setBlocks(blocksData);

        const iconsDataPromises = blocksData.map((block) =>
          fetchIcons(block.id).then((icons) => ({ blockId: block.id, icons }))
        );
        const iconsDataResults = await Promise.all(iconsDataPromises);

        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
      } finally {
        setLoadingBlocks(false);
      }
    };
    fetchProjectData();
  }, [selectedProjectId]);

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Text color="red.500">エラーが発生しました: {error.message}</Text>
      </Flex>
    );
  }

  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <Flex height="100vh" bg="gray.50" overflow="hidden" position="relative">
      {/* サイドバー */}
      <Box
        as="aside"
        width="240px"
        bg="gray.100"
        p={4}
        boxShadow="md"
        height="100vh"
        overflowY="auto"
      >
        <Heading as="h3" size="md" mb={4}>
          プロジェクト
        </Heading>
        <List spacing={3}>
          {projects.map((project) => (
            <ListItem key={project.id}>
              <Button
                variant={selectedProjectId === project.id ? "solid" : "ghost"}
                width="100%"
                justifyContent="flex-start"
                colorScheme={selectedProjectId === project.id ? "teal" : "gray"}
                onClick={() => setSelectedProjectId(project.id)}
              >
                {project.name}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* メインコンテンツ */}
      <Box
        as="main"
        flex="1"
        p={6}
        bg="white"
        borderLeft="1px solid #e2e8f0"
        overflowY="auto"
      >
        {selectedProject ? (
          <VStack align="start" spacing={4}>
            <Heading as="h1" size="xl" mb={4}>
              {selectedProject.name} のダッシュボード
            </Heading>
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
              {loadingBlocks ? (
                <Spinner />
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {blocks.map((block) => (
                    <Box
                      key={block.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                      // ブロック自体の大きさ固定
                      width="320px"
                      height="320px"
                      overflow="hidden"
                      display="flex"
                      flexDirection="column"
                    >
                      {/* 見出し部分も一行に収まるようにする */}
                      <Heading
                        as="h3"
                        size="md"
                        mb={4}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {block.tag_name}
                      </Heading>

                      {/* アイコンを2x2グリッドで配置 */}
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gridTemplateRows="repeat(2, 1fr)"
                        gap={2}
                        flex="1"
                      >
                        {blockIconsMap[block.id] &&
                          blockIconsMap[block.id].slice(0, 4).map((icon) => (
                            <Box
                              key={icon.id}
                              p={2}
                              borderWidth="1px"
                              borderRadius="md"
                              boxShadow="sm"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              // 各アイコン枠も一定のサイズを確保
                              width="100%"
                              height="100%"
                              overflow="hidden"
                            >
                              <img
                                src={icon.image_url}
                                alt={icon.name}
                                style={{
                                  marginBottom: "8px",
                                  maxWidth: "48px",
                                  maxHeight: "48px",
                                }}
                              />
                              <Text
                                textAlign="center"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                maxWidth="100%"
                              >
                                {icon.name}
                              </Text>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </VStack>
        ) : (
          <Text>プロジェクトが選択されていません。</Text>
        )}
      </Box>
      <Box position="absolute" bottom="20px" right="20px" zIndex="10">
        <NextLink href="/edit" passHref>
          <Button
            colorScheme="teal"
            size="lg"
            borderRadius="md"
            boxShadow="lg"
          >
            編集
          </Button>
        </NextLink>
      </Box>
    </Flex>
  );
};

export default DashboardPage;
