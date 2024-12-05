// src/app/page.jsx
'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Image,
  Link,
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <>
      {/* ナビゲーションバー */}
      <Box bg="teal.500" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box color="white" fontWeight="bold" fontSize="xl">
            ロゴ
          </Box>
          <Flex alignItems="center">
            <Link px={2} py={1} rounded="md" color="white" href="#">
              ホーム
            </Link>
            <Link px={2} py={1} rounded="md" color="white" href="#">
              サービス
            </Link>
            <Link px={2} py={1} rounded="md" color="white" href="#">
              お問い合わせ
            </Link>
          </Flex>
        </Flex>
      </Box>

      {/* ヒーローセクション */}
      <Container maxW="container.xl" py={16}>
        <Stack
          align="center"
          spacing={8}
          py={20}
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack flex={1} spacing={5}>
            <Heading fontSize={{ base: '3xl', md: '5xl' }}>
              ようこそ、私たちのサイトへ
            </Heading>
            <Text color="gray.500" fontSize={{ base: 'md', lg: 'lg' }}>
              ここにキャッチコピーや紹介文を入れます。あなたのビジネスやサービスの魅力を伝えましょう。
            </Text>
            <Button
              rounded="full"
              size="lg"
              fontWeight="bold"
              px={6}
              colorScheme="teal"
              bg="teal.400"
              _hover={{ bg: 'teal.500' }}
            >
              詳しく見る
            </Button>
          </Stack>
          <Flex flex={1} justify="center" align="center">
            <Image
              alt="Hero Image"
              objectFit="cover"
              src="https://source.unsplash.com/random/400x400"
            />
          </Flex>
        </Stack>
      </Container>

      {/* フッター */}
      <Box bg="teal.500" color="white" py={4}>
        <Container maxW="container.xl" textAlign="center">
          © 2023 あなたの会社名. All rights reserved.
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
