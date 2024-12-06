// Header.jsx
import React from 'react';
import Link from 'next/link';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
} from '@chakra-ui/react';

const GreenAppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="24px"
    height="24px"
  >
    {/* リンゴの本体 */}
    <path
      d="M32 12c-10 0-18 8-18 18s8 18 18 18 18-8 18-18-8-18-18-18z"
      fill="#7ed321" // 黄緑色
    />
    {/* 葉っぱ */}
    <path
      d="M37 6c2-4 6-4 8 0s-2 8-6 8-6-4-2-8z"
      fill="#2ecc71" // 濃い緑
    />
  </svg>
);

const Header = () => {
  return (
    <Box bg="teal.500" px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* ロゴ部分 */}
        <Link href="/" passHref>
          <Flex alignItems="center" cursor="pointer">
            <Box mr={2}>
              <GreenAppleIcon />
            </Box>
            <Heading
              size="md"
              color="white"
              fontFamily="'Poppins', sans-serif"
              fontWeight="bold"
              letterSpacing="widest"
            >
              App Platform
            </Heading>
          </Flex>
        </Link>

        {/* ナビゲーションメニュー */}
        <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }}>
          <Link href="/" passHref>
            <Button variant="link" color="white" fontWeight="bold">
              まずは試す
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="link" color="white" fontWeight="bold">
              新規登録
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="link" color="white" fontWeight="bold">
              ログイン
            </Button>
          </Link>
        </HStack>

        {/* モバイルメニュー */}
        <Button
          display={{ base: 'block', md: 'none' }}
          color="white"
          variant="outline"
          size="sm"
        >
          メニュー
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
