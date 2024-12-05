// src/app/page.jsx
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
  Image,
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <>
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
              as={Link} 
              rounded="full"
              size="lg"
              fontWeight="bold"
              px={6}
              colorScheme="teal"
              bg="teal.400"
              _hover={{ bg: 'teal.500' }}
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
          {/* <Flex flex={1} justify="center" align="center">
            <Image
              alt="Hero Image"
              objectFit="cover"
              src="https://source.unsplash.com/random/400x400"
            />
          </Flex> */}
        </Stack>
      </Container>
    </>
  );
};

export default HomePage;
