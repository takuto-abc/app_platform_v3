'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Button,
  IconButton,
  SimpleGrid,
  InputGroup,
  Input,
  InputLeftElement,
  Spacer,
} from '@chakra-ui/react';
import { FaHeart, FaBookmark, FaSearch } from 'react-icons/fa';

const NoteLikePage = () => {
  const [posts] = useState([
    {
      id: 1,
      title: 'はじめてのビジネスクラスで行くアイスランド旅行',
      content: 'アイスランドの魅力をたっぷり紹介します。',
      likes: 118,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 2,
      title: 'わたしが新卒で田舎村に移住した理由',
      content: '地方での新しい生活に挑戦した話。',
      likes: 72,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 3,
      title: 'ガンダムの新作発表と期待感',
      content: 'ガンダムファン必見のイベントレポート。',
      likes: 36,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 4,
      title: 'お菓子デッキポイント３つ',
      content: 'ユニークなお菓子を紹介。',
      likes: 60,
      image: 'https://via.placeholder.com/300',
    },
  ]);

  return (
    <Flex minH="100vh" bg="gray.900" color="white">
      {/* サイドバー */}
      <Box
        as="aside"
        w="240px"
        p={4}
        display={{ base: 'none', md: 'block' }}
        bg="gray.800"
      >
        <VStack align="start" spacing={4}>
          <Heading size="md">すべて</Heading>
          <Heading size="sm" pt={2}>投稿企画</Heading>
          <Heading size="sm" pt={2}>カテゴリ</Heading>
          <VStack align="start" spacing={2} pl={2}>
            <Button variant="ghost" colorScheme="teal" size="sm">
              家庭
            </Button>
            <Button variant="ghost" colorScheme="teal" size="sm">
              ライフスタイル
            </Button>
            <Button variant="ghost" colorScheme="teal" size="sm">
              食べ物
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* メインコンテンツ */}
      <Box flex={1} p={6}>
        {/* 検索ボックス */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">人気のテンプレート</Heading>
          <InputGroup maxW="400px" size="md">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="キーワードを検索"
              bg="gray.800"
              color="white"
              border="none"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ boxShadow: 'outline' }}
            />
          </InputGroup>
        </Flex>

        {/* 投稿リスト */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {posts.map((post) => (
            <Box
              key={post.id}
              bg="gray.800"
              borderRadius="md"
              overflow="hidden"
              boxShadow="md"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              {/* 画像サイズを調整 */}
              <Image
                src={post.image}
                alt={post.title}
                boxSize="200px" // 画像のサイズを小さく設定
                objectFit="cover" // 画像を切り取る形で調整
                mx="auto" // 画像を中央揃え
                mt={4} // 上部に余白を追加
              />
              <Box p={4}>
                <Heading size="sm" noOfLines={1} mb={2}>
                  {post.title}
                </Heading>
                <Text fontSize="sm" color="gray.400" noOfLines={2}>
                  {post.content}
                </Text>
                <HStack mt={4} spacing={4}>
                  <IconButton
                    aria-label="いいね"
                    icon={<FaHeart />}
                    size="sm"
                    variant="ghost"
                    colorScheme="teal"
                  />
                  <Text fontSize="sm">{post.likes}</Text>
                  <Spacer />
                  <IconButton
                    aria-label="保存"
                    icon={<FaBookmark />}
                    size="sm"
                    variant="ghost"
                    colorScheme="teal"
                  />
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

      </Box>
    </Flex>
  );
};

export default NoteLikePage;
