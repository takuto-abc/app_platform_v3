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
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
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
        <VStack align="start" spacing={6}>
          <Heading as="h1" size="xl">
            編集ページ
          </Heading>

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
                <FormLabel>プロジェクト名</FormLabel>
                <Input
                  placeholder="タイトルを入力"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl id="category" isRequired>
                <FormLabel>用途</FormLabel>
                <Select
                  placeholder="選択してください"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="旅行">旅行</option>
                  <option value="就職活動">就職活動</option>
                  <option value="ゼミの論文作成">ゼミの論文作成</option>
                </Select>
              </FormControl>
              {/* 検索バー */}
              <FormControl id="search" isRequired>
                <FormLabel>アイコンを検索</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="アプリケーション名を入力"
                    onChange={(e) => handleSelectProject(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="content" isRequired>
                <FormLabel>説明</FormLabel>
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
