"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Button,
  VStack,
  Text,
  Spinner,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { fetchBlocks, fetchIcons, postProject, fetchProjects, unpostProject } from "../api/posts";
import useFetchData from "../api/useFetchPosts";
import { CloseIcon, ChevronRightIcon, ChevronLeftIcon, IconButton } from "@chakra-ui/icons";


const DashboardPage = () => {
  const { data: projects, loading, error, refetch } = useFetchData("projects");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [blockIconsMap, setBlockIconsMap] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [successMessage, setSuccessMessage] = useState(""); // 成功メッセージ
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null;


  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === null) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);
  

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!selectedProjectId) {
        console.warn("プロジェクトが選択されていません");
        return;
      }
      setLoadingBlocks(true);
      try {  
        // ブロックデータの取得
        const blocksData = await fetchBlocks(selectedProjectId);
        setBlocks(blocksData);
  
        // 各ブロックのアイコンデータの取得
        const iconsDataPromises = blocksData.map((block) => {
          return fetchIcons(block.id)
            .then((icons) => {
              return { blockId: block.id, icons };
            })
            .catch((error) => {
              return { blockId: block.id, icons: [] }; // エラーが発生した場合は空配列を返す
            });
        });
  
        const iconsDataResults = await Promise.all(iconsDataPromises);
  
        // アイコンデータをブロックIDごとにマッピング
        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
      } catch (err) {
        console.error("データの取得に失敗しました:", err);
      } finally {
        setLoadingBlocks(false);
      }
    };
    fetchProjectData();
  }, [selectedProjectId]);
  


  // 投稿/非投稿処理
  const handlePostProject = async () => {
    const newIsPosted = !selectedProject.is_posted;
  
    try {
      if (newIsPosted) {
        // 投稿する
        await postProject(selectedProject.id);
        setSuccessMessage(`${selectedProject.name} が投稿されました！`);
      } else {
        // 投稿を解除する
        await unpostProject(selectedProject.id);
        setSuccessMessage(`${selectedProject.name} の投稿が解除されました！`);
      }
  
      setIsSuccessModalOpen(true); // 成功モーダルを開く
      refetch(); // プロジェクトリストを再取得して状態を更新
    } catch (error) {
      console.error("投稿/投稿解除失敗:", error);
      setErrorMessage("投稿/投稿解除に失敗しました。もう一度お試しください。");
      setIsErrorModalOpen(true); // エラーモーダルを開く
    } finally {
      setIsModalOpen(false); // モーダルを閉じる
    }
  };
  
  


  // Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Text color="red.500">エラーが発生しました: {error.message}</Text>
      </Flex>
    );
  }

  return (
    <Flex height="100vh" bg="gray.50" overflow="hidden" position="relative">
      {/* サイドバー */}
      <Box
        as="aside"
        transition="width 0.3s ease"
        width={isSidebarOpen ? "240px" : "0px"}
        bg="gray.100"
        p={isSidebarOpen ? 4 : 0}
        boxShadow={isSidebarOpen ? "md" : "none"}
        height="100vh"
        overflowY="auto"
      >
        {isSidebarOpen && (
          <>
            {/* サイドバー内の閉じるボタン */}
            <Flex justify="flex-end" mb={4}>
              <Button
                variant="solid"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                bg="teal.500"
                color="white"
                _hover={{ bg: "teal.600" }}
                width="32px"
                height="32px"
                p={0}
                minWidth="32px"
              >
                <ChevronLeftIcon boxSize="1.5em"/>
              </Button>
            </Flex>

            <Heading as="h3" size="md" mb={4}>
              プロジェクト
            </Heading>
            <List spacing={3}>
              {projects.map((project) => (
                <ListItem key={project.id}>
                  <Button
                    variant={selectedProjectId === project.id ? "solid" : "ghost"}
                    width="100%"
                    justifyContent="flex-start"
                    colorScheme={selectedProjectId === project.id ? "teal" : "gray"}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    {project.name}
                  </Button>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* メインコンテンツ */}
      <Box
        as="main"
        flex="1"
        p={6}
        bg="white"
        borderLeft="1px solid #e2e8f0"
        overflowY="auto"
        mt={8} 
      >
        {selectedProject ? (
          <VStack align="start" spacing={4}>
            <Heading as="h1" size="xl" mb={4}>
              {selectedProject.name} のダッシュボード
            </Heading>
            <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
              {loadingBlocks ? (
                <Spinner />
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {blocks.map((block) => (
                    <Box
                      key={block.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                      width="320px"
                      height="320px"
                      overflow="hidden"
                      display="flex"
                      flexDirection="column"
                    >
                      <Heading
                        as="h3"
                        size="md"
                        mb={4}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {block.tag_name}
                      </Heading>
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gridTemplateRows="repeat(2, 1fr)"
                        gap={2}
                        flex="1"
                      >
                        {blockIconsMap[block.id] &&
                          blockIconsMap[block.id].slice(0, 4).map((icon) => (
                            <Box
                              key={icon.id}
                              p={2}
                              borderWidth="1px"
                              borderRadius="md"
                              boxShadow="sm"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              width="100%"
                              height="100%"
                              overflow="hidden"
                              cursor="pointer"
                              onClick={() => setSelectedIcon(icon)}
                            >
                              <Box
                                width="48px"
                                height="48px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                overflow="hidden"
                              >
                                <img
                                  src={icon.image_url}
                                  alt={icon.name}
                                  style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              </Box>
                              <Text
                                textAlign="center"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                maxWidth="100%"
                                mt={2}
                              >
                                {icon.name}
                              </Text>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </VStack>
        ) : (
          <Text>プロジェクトが選択されていません。</Text>
        )}
      </Box>

      {/* サイドバーが閉じているときのみ表示する開くボタン（左上、透過背景、太い矢印） */}
      {!isSidebarOpen && (
        <Box position="absolute" top="0" left="0" zIndex="10">
          <IconButton
            icon={<ChevronRightIcon boxSize="2em" />} // アイコンを大きく
            aria-label="Open Sidebar" // アクセシビリティ用
            onClick={() => setIsSidebarOpen(true)}
            variant="ghost"
            colorScheme="gray"
            size="mg" // ボタン全体のサイズを大きく
            borderRadius="md" // 少し丸みを付ける
            _hover={{ bg: "gray.200" }} // ホバー時の背景色
            width="40px" // ボタンの幅を指定
            height="40px" // ボタンの高さを指定
            mt={2}
            ml={3}
          />
        </Box>
      )}
      <Box position="absolute" bottom="20px" right="20px" zIndex="10">
        <Flex gap="4" align="center">
          {/* 投稿ボタン */}
          <Button
            colorScheme={selectedProject?.is_posted ? "red" : "blue"}
            size="lg"
            onClick={() => {
              if (!selectedProject) {
                alert("プロジェクトが選択されていません。");
                return;
              }
              setIsModalOpen(true);
            }}
          >
            {selectedProject?.is_posted ? "投稿を取り消す" : "投稿する"}
          </Button>
          {/* 編集ボタン */}
          <NextLink href="/edit" passHref>
            <Button colorScheme="teal" size="lg" borderRadius="md" boxShadow="lg">
              編集
            </Button>
          </NextLink>
        </Flex>
      </Box>

      {/* 右サイドバー（詳細） */}
      {selectedIcon && (
        <Box
          position="absolute"
          top="0"
          right="0"
          width="300px"
          height="100vh"
          bg="white"
          borderLeft="1px solid #e2e8f0"
          boxShadow="lg"
          p={4}
          zIndex="20"
          display="flex"
          flexDirection="column"
        >
          {/* 閉じるボタン */}
          <Flex justify="flex-end" mb={4}>
            <Button
              variant="solid"
              size="sm"
              onClick={() => setSelectedIcon(null)}
              bg="teal.500"
              color="white"
              _hover={{ bg: "teal.600" }}
              width="32px"
              height="32px"
              p={0}
              minWidth="32px"
            >
              <CloseIcon boxSize="0.7em" />
            </Button>
          </Flex>
          {/* アイコン詳細 */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              width="96px"
              height="96px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              mb={2}
            >
              <img
                src={selectedIcon.image_url}
                alt={selectedIcon.name}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {selectedIcon.name}
            </Text>
            <Text>アイコンID: {selectedIcon.id}</Text>
          </Box>
        </Box>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProject 
              ? (selectedProject.is_posted ? "投稿を取り消す確認" : "投稿確認")
              : "プロジェクトが選択されていません"}
          </ModalHeader>
          <ModalBody>
            {selectedProject ? (
              <Text>
                {selectedProject.is_posted
                  ? `${selectedProject.name} の投稿を取り消しますか？`
                  : `${selectedProject.name} を投稿しますか？`}
              </Text>
            ) : (
              <Text>プロジェクトが選択されていません。</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedProject && (
              <Button
                colorScheme={selectedProject.is_posted ? "red" : "blue"} // 投稿済みの場合は赤、それ以外は青
                onClick={handlePostProject}
              >
                {selectedProject.is_posted ? "投稿を取り消す" : "投稿する"}
              </Button>
            )}
            <Button ml={3} onClick={() => setIsModalOpen(false)}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 成功モーダル */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>成功</ModalHeader>
          <ModalBody>
            <Text>{successMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => setIsSuccessModalOpen(false)}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* エラーモーダル */}
      <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>エラー</ModalHeader>
          <ModalBody>
            <Text>{errorMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => setIsErrorModalOpen(false)}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </Flex>
  );
};

export default DashboardPage;
