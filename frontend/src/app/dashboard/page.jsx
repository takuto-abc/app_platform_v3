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
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react';
import { FaHeart, FaBookmark, FaSearch, FaHashtag } from 'react-icons/fa';
import NextLink from 'next/link'; // Link機能を追加

const NoteLikePage = () => {
  const [posts] = useState([
    {
      id: 1,
      title: '大阪→関東に3泊4日で旅行に行った時に使ったサービス',
      content: '#旅行 #交通手段 #計画立て #予約管理 #お店探し',
      likes: 118,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 2,
      title: 'エンジニア就活で使ったサービス',
      content: '#就活 #エンジニア #進捗管理 #スケジュール管理 #就活エージェント',
      likes: 72,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 3,
      title: '投資を始めるときに使ったサービス',
      content: '#投資 #ポートフォリオ選択 #株価 #口座開設 #投資計画',
      likes: 36,
      image: 'https://via.placeholder.com/300',
    },
    {
      id: 4,
      title: '引越しをするまでに使ったサービス',
      content: '#引越し #書類管理 #物件探し #費用見積もり',
      likes: 60,
      image: 'https://via.placeholder.com/300',
    },
  ]);

  return (
    <Flex minH="100vh" bg="gray.900" color="white" direction="column">
      {/* ヘッダー */}
      <Flex justify="space-between" align="center" p={4} bg="gray.800">
        <Heading size="lg" color="white">
          人気のテンプレート
        </Heading>
        <NextLink href="/analytics" passHref>
          <Button colorScheme="teal" size="md">
            ランキング
          </Button>
        </NextLink>
      </Flex>

      <Flex flex={1}>
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
            <Heading size="sm" pt={2}>プロジェクト</Heading>
            <Heading size="sm" pt={2}>カテゴリ</Heading>
            <VStack align="start" spacing={2} pl={2}>
              <Button variant="ghost" colorScheme="teal" size="sm">
                旅行
              </Button>
              <Button variant="ghost" colorScheme="teal" size="sm">
                ライフスタイル
              </Button>
              <Button variant="ghost" colorScheme="teal" size="sm">
                就職活動
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* メインコンテンツ */}
        <Box flex={1} p={6}>
          {/* 検索ボックス */}
          <Flex justify="space-between" align="center" mb={6}>
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
                    {post.content
                      .split(' ')
                      .filter((word) => word.startsWith('#'))
                      .map((tag, index) => (
                        <Tag
                          key={index}
                          size="sm"
                          variant="ghost"
                          colorScheme="teal"
                          borderRadius="md"
                          mr={1}
                          mb={1}
                        >
                          <TagLeftIcon as={FaHashtag} />
                          <TagLabel>{tag.replace('#', '')}</TagLabel>
                        </Tag>
                      ))}
                  </Text>

                  <HStack mt={4} spacing={1}>
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
    </Flex>
  );
};

export default NoteLikePage;
