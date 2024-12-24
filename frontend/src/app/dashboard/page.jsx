"use client";

import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { fetchPostedProjects } from "../api/posts"; // 修正されたエンドポイントを使用
import NextLink from "next/link";

const PostedPage = () => {
  const [projects, setProjects] = useState([]); // 投稿済みプロジェクトを格納
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [selectedProject, setSelectedProject] = useState(null); // 選択されたプロジェクト

  // データフェッチ用の useEffect
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true); // ローディング状態を開始
        const data = await fetchPostedProjects(); // APIから投稿済みプロジェクトを取得
        setProjects(data); // プロジェクトを状態に保存
      } catch (error) {
        console.error("投稿済みプロジェクトの取得に失敗しました:", error);
      } finally {
        setLoading(false); // ローディング状態を終了
      }
    };

    loadProjects();
  }, []);

  // モーダルを開く関数
  const openModal = (project) => {
    setSelectedProject(project); // 選択したプロジェクトを保存
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
          投稿済みプロジェクト
        </Heading>
        <NextLink href="/create" passHref>
          <Button colorScheme="teal" size="md">
            新規作成
          </Button>
        </NextLink>
      </Flex>

      {/* 投稿済みプロジェクトの表示 */}
      <Flex flex={1}>
        <Box flex={1} p={6}>
          {projects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {projects.map((project) => (
                <Box
                  key={project.id}
                  bg="gray.800"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  cursor="pointer"
                  onClick={() => openModal(project)} // モーダルを開く
                >
                  <Image
                    src={project.image || "https://via.placeholder.com/300"}
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
                      {project.description || "説明はありません。"}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text>投稿済みプロジェクトはありません。</Text>
          )}
        </Box>
      </Flex>

      {/* プロジェクト詳細モーダル */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProject?.name || "プロジェクト名未設定"}</ModalHeader>
          <ModalBody>
            <Text>プロジェクトID: {selectedProject?.id || "不明"}</Text>
            <Text>プロジェクト名: {selectedProject?.name || "不明"}</Text>
            <Text>プロジェクト説明: {selectedProject?.description || "説明がありません。"}</Text>
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

export default PostedPage;
