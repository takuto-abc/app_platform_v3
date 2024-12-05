import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stack,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';

// サーバーサイドでデータを取得する関数
async function fetchPosts() {
  const res = await fetch('http://127.0.0.1:8000/posts', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('記事の取得に失敗しました');
  }
  return res.json();
}

const Main = async () => {
  const posts = await fetchPosts();

  return (
    <Box height="100vh">
      {/* ヘッダー */}
      <Box as="header" bg="teal.500" p={4} color="white">
        <Heading size="lg" display="inline-block" mr="auto">
          サイト名
        </Heading>
        <Stack direction="row" spacing={4} mt={2}>
          <Button
            as={NextLink}
            href="/dashboard"
            variant="outline"
            colorScheme="whiteAlpha"
          >
            ダッシュボード
          </Button>
          <Button
            as={NextLink}
            href="/edit"
            variant="solid"
            colorScheme="whiteAlpha"
          >
            編集
          </Button>
        </Stack>
      </Box>

      {/* グリッドレイアウト */}
      <Grid
        templateColumns={{ base: '1fr', md: '240px 1fr' }}
        height="calc(100vh - 64px)" // ヘッダーの高さを引く
        gap={4}
      >
        {/* サイドバー */}
        <GridItem
          as="aside"
          bg="gray.100"
          p={4}
          boxShadow="md"
          width="240px"
          display={{ base: 'none', md: 'block' }} // モバイルでは非表示
        >
          <Heading as="h3" size="md" mb={4}>
            ナビゲーション
          </Heading>
          <Stack spacing={3}>
            <Button as={NextLink} href="/dashboard" variant="ghost">
              ダッシュボード
            </Button>
            <Button as={NextLink} href="/edit" variant="ghost">
              編集
            </Button>
            <Button as={NextLink} href="/profile" variant="ghost">
              プロフィール
            </Button>
          </Stack>
        </GridItem>

        {/* メインコンテンツ */}
        <GridItem as="main" p={6} bg="white" overflowY="auto">
          <Heading as="h1" size="xl" mb={6}>
            記事一覧
          </Heading>
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
              </Box>
            ))}
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Main;
