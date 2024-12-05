// frontend/src/app/mypage/page.jsx
'use client';

import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Text,
  Flex,
  Icon,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FaUser, FaChartLine, FaDollarSign } from 'react-icons/fa';

const MyPage = () => {
  return (
    <Box p={4}>
      <Heading mb={6}>ダッシュボード</Heading>

      {/* 統計情報のカード */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <StatCard
          title="ユーザー数"
          stat="1,234"
          icon={<Icon as={FaUser} w={8} h={8} />}
        />
        <StatCard
          title="売上"
          stat="$12,345"
          icon={<Icon as={FaDollarSign} w={8} h={8} />}
        />
        <StatCard
          title="トラフィック"
          stat="45,678"
          icon={<Icon as={FaChartLine} w={8} h={8} />}
        />
      </SimpleGrid>

      {/* 進捗バー */}
      <Box mb={6}>
        <Heading as="h3" size="md" mb={4}>
          目標達成率
        </Heading>
        <Progress colorScheme="teal" size="lg" value={70} />
        <Text mt={2}>現在の達成率: 70%</Text>
      </Box>

      {/* データテーブル */}
      <Box>
        <Heading as="h3" size="md" mb={4}>
          最近のアクティビティ
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ユーザー名</Th>
              <Th>アクション</Th>
              <Th>日時</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>山田太郎</Td>
              <Td>ログイン</Td>
              <Td>2023-10-01 10:00</Td>
            </Tr>
            <Tr>
              <Td>佐藤花子</Td>
              <Td>購入</Td>
              <Td>2023-10-01 09:30</Td>
            </Tr>
            {/* 他のデータを追加 */}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

const StatCard = ({ title, stat, icon }) => {
  return (
    <Stat
      px={4}
      py={5}
      bg="white"
      shadow="md"
      borderRadius="md"
      borderWidth="1px"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel fontWeight="medium">{title}</StatLabel>
          <StatNumber fontSize="2xl">{stat}</StatNumber>
        </Box>
        <Box color="teal.500">{icon}</Box>
      </Flex>
    </Stat>
  );
};

export default MyPage;
