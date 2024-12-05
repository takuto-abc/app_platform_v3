// Header.jsx
import React from 'react';
import Link from 'next/link';
import { Box, Flex, Heading, HStack, Spacer, Button } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center">
        <Link href="/" passHref>
          <Heading size="md" color="white" cursor="pointer">
            My Blog
          </Heading>
        </Link>
        <Spacer />
        <HStack as="nav" spacing={4}>
          <Link href="/" passHref>
            <Button variant="link" color="white">
              まずは試す
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button variant="link" color="white">
              新規登録
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="link" color="white">
              ログイン
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
