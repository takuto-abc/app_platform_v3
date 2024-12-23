'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  SimpleGrid,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { fetchProjects } from '../api/posts'; // API呼び出し関数をインポート
import NextLink from 'next/link';

const NoteLikePage = () => {
  const [projects, setProjects] = useState([]); // プロジェクトデータを格納
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [selectedProject, setSelectedProject] = useState(null); // 選択されたプロジェクト
  const [debugInfo, setDebugInfo] = useState(""); // デバッグ情報を格納

  // データフェッチ用の useEffect
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(); // API からプロジェクトデータを取得
        setProjects(data);
        setDebugInfo("プロジェクトデータの取得に成功しました");
      } catch (error) {
        setDebugInfo("プロジェクトデータの取得に失敗しました");
      } finally {
        setLoading(false); // ローディング完了
      }
    };

    loadProjects();
  }, []);

  // モーダルを開く関数
  const openModal = (project) => {
    setDebugInfo(`openModalで受け取ったプロジェクト: ${JSON.stringify(project, null, 2)}`);
    setSelectedProject(project); // 選択したプロジェクトをセット
    setIsModalOpen(true); // モーダルを開く
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="gray.900" color="white" direction="column">
      {/* ヘッダー */}
      <Flex justify="space-between" align="center" p={4} bg="gray.800">
        <Heading size="lg" color="white">
          人気のテンプレート
        </Heading>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => {
            window.location.href = "/analytics";
          }}
        >
          ランキング
        </Button>
      </Flex>
      <Flex flex={1}>
        {/* メインコンテンツ */}
        <Box flex={1} p={6}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {projects.map((project) => (
              <Box
                key={project.id}
                bg="gray.800"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.05)' }}
                cursor="pointer"
                onClick={() => openModal(project)} // モーダルを開く
              >
                <Image
                  src={project.image || 'https://via.placeholder.com/300'}
                  alt={project.name}
                  boxSize="200px"
                  objectFit="cover"
                  mx="auto"
                  mt={4}
                />
                <Box p={4}>
                  <Heading size="sm" noOfLines={1} mb={2}>
                    {project.name}
                  </Heading>

                  <Text fontSize="sm" color="gray.400" noOfLines={2}>
                    {project.description || '説明はありません。'}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      {/* モーダル */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProject?.name || 'プロジェクト名未設定'}</ModalHeader>
          <ModalBody>
            <Text>プロジェクトID: {selectedProject?.id || '不明'}</Text>
            <Text>プロジェクト名: {selectedProject?.name || '不明'}</Text>
            <Text>プロジェクト説明: {selectedProject?.description || '説明がありません。'}</Text>
          </ModalBody>
          <ModalFooter>
            <NextLink href={`/dashboard/${selectedProject?.id}`} passHref>
              <Button colorScheme="teal" mr={3}>
                詳細をみる
              </Button>
            </NextLink>
            <Button onClick={closeModal}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
};

export default NoteLikePage;
