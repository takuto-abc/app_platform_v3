// frontend/src/app/components/ui/Main.jsx

"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Link,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Dashboard from '../../ui/Dashboard.jsx';
import Edit from '../../ui/Edit';
import useFetchPosts from '../../../api/useFetchPosts';

const Main = () => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' または 'edit'
  const { posts, loading, error } = useFetchPosts();

  return (
    <Box>
      {/* ヘッダー */}
      <Flex as="header" bg="teal.500" p={4} align="center">
        <Button
          variant={currentView === 'dashboard' ? 'solid' : 'outline'}
          colorScheme="whiteAlpha"
          onClick={() => setCurrentView('dashboard')}
          mr={2}
        >
          ダッシュボード
        </Button>
        <Button
          variant={currentView === 'edit' ? 'solid' : 'outline'}
          colorScheme="whiteAlpha"
          onClick={() => setCurrentView('edit')}
        >
          編集
        </Button>
      </Flex>

      {/* メインコンテンツ */}
      <Box as="main" p={4}>
        {currentView === 'dashboard' ? <Dashboard /> : <Edit />}

        {/* ダッシュボード画面に記事一覧を表示 */}
        {currentView === 'dashboard' && (
          <Box mt={4}>
            {loading && (
              <Flex justify="center" align="center">
                <Spinner />
                <Text ml={2}>読み込み中...</Text>
              </Flex>
            )}
            {error && (
              <Text color="red.500">記事の取得に失敗しました。</Text>
            )}
            {!loading && !error && (
              <Stack spacing={4}>
                {posts.map((post) => (
                  <Box
                    key={post.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Heading as="h2" size="md">
                      {post.title}
                    </Heading>
                    <Text mt={2}>{post.excerpt}</Text>
                    <NextLink href={`/posts/${post.id}`} passHref>
                      <Link color="teal.500" mt={2} display="inline-block">
                        続きを読む
                      </Link>
                    </NextLink>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Main;
