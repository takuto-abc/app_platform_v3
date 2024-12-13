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
  const [selectedIcons, setSelectedIcons] = useState([]);

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const fetchProjectBlocks = async () => {
      if (selectedProjectId) {
        setLoadingBlocks(true);
        try {
          const blocksData = await fetchBlocks(selectedProjectId);
          setBlocks(blocksData);
        } catch (err) {
          console.error("ブロックの取得に失敗しました:", err);
        } finally {
          setLoadingBlocks(false);
        }
      }
    };

    fetchProjectBlocks();
  }, [selectedProjectId]);

  const handleBlockClick = async (blockId) => {
    try {
      const iconsData = await fetchIcons(blockId);
      setSelectedIcons(iconsData);
    } catch (err) {
      console.error("アイコンの取得に失敗しました:", err);
    }
  };

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
              {/* タグごとのグリッド */}
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
                      onClick={() => handleBlockClick(block.id)}
                    >
                      <Heading as="h3" size="md" mb={4}>
                        {block.tag_name}
                      </Heading>
                      <Flex
                        direction="row"
                        wrap="wrap"
                        gap={4}
                        justifyContent="space-around"
                      >
                        {selectedIcons.map((icon) => (
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
                          >
                            <img
                              src={icon.image_url}
                              alt={icon.name}
                              width="48"
                              height="48"
                              style={{
                                marginBottom: "8px",
                              }}
                            />
                            <Text textAlign="center">{icon.name}</Text>
                          </Box>
                        ))}
                      </Flex>
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
