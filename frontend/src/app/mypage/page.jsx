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
} from "@chakra-ui/react";
import NextLink from "next/link";
import useFetchData from "../api/useFetchPosts"; // カスタムフックをインポート

const DashboardPage = () => {
  const { data: projects, loading, error } = useFetchData("projects"); // プロジェクトデータを取得
  const [selectedProjectId, setSelectedProjectId] = useState(null); // 選択されたプロジェクトID

  useEffect(() => {
    // 初期選択プロジェクトを設定
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id); // 最初のプロジェクトを選択
    }
  }, [projects, selectedProjectId]);

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

  // 現在選択されているプロジェクト
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
      >
        {selectedProject ? (
          <VStack align="start" spacing={4}>
            <Heading as="h1" size="xl" mb={4}>
              {selectedProject.name} のダッシュボード
            </Heading>
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
              <Heading as="h2" size="md" mb={2}>
                {selectedProject.name} の詳細
              </Heading>
              <Text>{selectedProject.description}</Text>
              {selectedProject.content?.blocks && (
                <Box mt={4}>
                  <Heading as="h3" size="sm" mb={2}>
                    ブロック
                  </Heading>
                  <List spacing={3}>
                    {selectedProject.content.blocks.map((block, index) => (
                      <ListItem key={index}>
                        <Heading as="h4" size="sm" mb={1}>
                          {block.tag_name}
                        </Heading>
                        <List spacing={1} ml={4}>
                          {block.icons.map((icon, iconIndex) => (
                            <ListItem key={iconIndex}>
                              <Flex align="center">
                                <img
                                  src={icon.image_url}
                                  alt={icon.name}
                                  width="24"
                                  height="24"
                                  style={{ marginRight: "8px" }}
                                />
                                <Text>{icon.name}</Text>
                              </Flex>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    ))}
                  </List>
                </Box>
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
