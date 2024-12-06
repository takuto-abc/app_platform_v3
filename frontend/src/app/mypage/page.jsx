'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Button,
  VStack,
  Text,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const DashboardPage = () => {
  const [selectedProject, setSelectedProject] = useState('旅行');
  const projects = ['旅行', '就職活動', 'ゼミの論文作成'];

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

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
            <ListItem key={project}>
              <Button
                variant={selectedProject === project ? 'solid' : 'ghost'}
                width="100%"
                justifyContent="flex-start"
                colorScheme={selectedProject === project ? 'teal' : 'gray'}
                onClick={() => handleSelectProject(project)}
              >
                {project}
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
        <VStack align="start" spacing={4}>
          <Heading as="h1" size="xl" mb={4}>
            {selectedProject} のダッシュボード
          </Heading>
          <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            <Heading as="h2" size="md" mb={2}>
              {selectedProject} の詳細
            </Heading>
            <Text>
              ここに {selectedProject} に関連するコンテンツを表示します。
              選択されたプロジェクトに応じて内容を変更できます。
            </Text>
          </Box>
        </VStack>
      </Box>
      <Box position="absolute" bottom="20px" right="20px" zIndex="10">
        <NextLink href="/edit" passHref>
          <Button
            colorScheme="teal"
            size="lg"
            borderRadius="md" // 角を少し丸めた四角形に変更
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
