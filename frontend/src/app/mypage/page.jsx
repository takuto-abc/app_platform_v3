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
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import useFetchData from "../api/useFetchPosts"; // カスタムフックをインポート

const DashboardPage = () => {
  const { data: projects, loading, error } = useFetchData("projects");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // レスポンシブ対応: ブロックの列数を動的に変更
  const gridColumns = useBreakpointValue({ base: 1, md: 2 });

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
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
      <Box as="main" flex="1" p={6} bg="white" borderLeft="1px solid #e2e8f0">
        {selectedProject ? (
          <VStack align="start" spacing={4}>
            <Heading as="h1" size="xl" mb={4}>
              {selectedProject.name} のダッシュボード
            </Heading>
            {/* <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm"> */}
              {/* タグごとのグリッド */}
              {selectedProject.content?.blocks && (
                <SimpleGrid columns={gridColumns} spacing={6}>
                  {selectedProject.content.blocks.map((block, blockIndex) => (
                    <Box
                      key={blockIndex}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Heading as="h3" size="md" mb={4}>
                        {block.tag_name}
                      </Heading>
                      <VStack spacing={4} align="start">
                        {block.icons.map((icon, iconIndex) => (
                          <Flex
                            key={iconIndex}
                            align="center"
                            p={2}
                            borderWidth="1px"
                            borderRadius="md"
                            width="100%"
                          >
                            <img
                              src={icon.image_url}
                              alt={icon.name}
                              width="48"
                              height="48"
                              style={{ marginRight: "8px" }}
                            />
                            <Text>{icon.name}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            {/* </Box> */}
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
