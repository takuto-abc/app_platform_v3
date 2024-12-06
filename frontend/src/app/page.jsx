'use client';
import React from 'react';
import Link from 'next/link'; 
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Flex
      height="100vh" // 画面全体の高さを確保
      align="center" // 垂直方向中央揃え
      justify="center" // 水平方向中央揃え
      bg="gray.100" // 背景色（オプション）
      px={4} // 小さい画面で左右に余白を追加
    >
      <Container maxW="container.md" textAlign="center">
        <Stack spacing={8} align="center">
          <Heading fontSize={{ base: '3xl', md: '5xl' }}>
            App Platform
          </Heading>
          <Text color="gray.500" fontSize={{ base: 'md', lg: 'lg' }}>
            App Platformへようこそ！<br />
            アプリケーション・サービスをここで一元管理しましょう。
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
            <Button
              as={Link}
              rounded="full"
              size="lg"
              fontWeight="bold"
              px={20}
              colorScheme="teal"
              bg="teal.400"
              _hover={{ bg: "teal.500" }}
              href="/mypage"
            >
              マイページへ
            </Button>
            <Button
              as={Link}
              rounded="full"
              size="lg"
              fontWeight="bold"
              px={6}
              colorScheme="teal"
              bg="teal.400"
              _hover={{ bg: 'teal.500' }}
              href="/dashboard"
            >
              誰かのテンプレートを見る
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
};

export default HomePage;
