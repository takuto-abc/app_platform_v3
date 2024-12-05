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
import SearchBar from '../components/ui/SearchBar';
import ClickOpen from '../components/ui/ClickOpen';

const EditPage = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const toast = useToast();

  const handleSelectProject = (project) => {
    setCurrentProject(project);
    setTitle('');
    setCategory('');
    setContent('');
    toast({
      title: `${project} を選択しました。`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleUpdate = () => {
    if (!currentProject) {
      toast({
        title: 'プロジェクトを選択してください。',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: '更新が完了しました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setTitle('');
    setCategory('');
    setContent('');
  };

  return (
    <Box display="flex">
      {/* メインコンテンツ */}
      <Box
        ml={{ base: 0, md: '200px' }}
        mt="64px" // ヘッダーの高さを考慮
        p={6}
        width="100%"
      >
        <VStack align="start" spacing={4}>
          <Heading as="h1" size="xl">
            編集ページ
          </Heading>

          {/* 検索バー */}
          <SearchBar onSelectProject={handleSelectProject} />

          {/* 選択されたプロジェクトの詳細 */}
          {currentProject && (
            <ClickOpen
              icon={{
                name: currentProject,
                imageUrl: 'https://via.placeholder.com/100',
                url: 'https://example.com',
              }}
            />
          )}

          {/* 編集フォーム */}
          <Box
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            width="100%"
          >
            <VStack spacing={4} align="stretch">
              <FormControl id="title" isRequired>
                <FormLabel>タイトル</FormLabel>
                <Input
                  placeholder="タイトルを入力"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl id="category" isRequired>
                <FormLabel>カテゴリ</FormLabel>
                <Select
                  placeholder="カテゴリを選択"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="旅行">旅行</option>
                  <option value="就職活動">就職活動</option>
                  <option value="ゼミの論文作成">ゼミの論文作成</option>
                </Select>
              </FormControl>

              <FormControl id="content" isRequired>
                <FormLabel>コンテンツ</FormLabel>
                <Textarea
                  placeholder="コンテンツを入力"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </FormControl>

              <Button colorScheme="teal" onClick={handleUpdate}>
                更新する
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default EditPage;
