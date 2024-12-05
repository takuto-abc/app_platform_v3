// frontend/src/app/edit/page.jsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';

const EditPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const toast = useToast();

  const handleUpdate = () => {
    // データの送信処理をここに追加（例: API リクエスト）
    // 成功時のフィードバック
    toast({
      title: '更新が完了しました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="600px" mx="auto" mt={8} p={4}>
      <Heading mb={6}>編集ページ</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl id="title">
          <FormLabel>タイトル</FormLabel>
          <Input
            type="text"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl id="category">
          <FormLabel>カテゴリー</FormLabel>
          <Select
            placeholder="カテゴリーを選択"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="technology">テクノロジー</option>
            <option value="health">健康</option>
            <option value="finance">金融</option>
            {/* 他のオプションを追加 */}
          </Select>
        </FormControl>

        <FormControl id="content">
          <FormLabel>内容</FormLabel>
          <Textarea
            placeholder="内容を入力してください"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="teal" size="lg" onClick={handleUpdate}>
          更新
        </Button>
      </VStack>
    </Box>
  );
};

export default EditPage;
