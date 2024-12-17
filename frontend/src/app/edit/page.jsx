"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  Button,
  List,
  ListItem,
  SimpleGrid,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import {
  fetchProjects,
  fetchBlocks,
  fetchIcons,
  createBlock,
  updateBlock,
  createIcon,
  updateIcon,
  updateProject,
  createProject,
  deleteIcon,
  validateIcon,
} from "../api/posts";

const EditPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [blockIconsMap, setBlockIconsMap] = useState({});
  const [editingProjectName, setEditingProjectName] = useState("");
  const [editingProjectDescription, setEditingProjectDescription] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newBlockName, setNewBlockName] = useState("");
  const [newIconName, setNewIconName] = useState("");
  const [newIconUrl, setNewIconUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddingNewProject, setIsAddingNewProject] = useState(false); // フォームの開閉管理
  const [selectedIcon, setSelectedIcon] = useState(null); // 選択されたアイコン
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉状態
  const [deletedIconIds, setDeletedIconIds] = useState([]);


  // データフェッチ

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const projectData = await fetchProjects();
        setProjects(projectData);
      } catch (error) {
        console.error("プロジェクトデータの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!selectedProject) return;
      try {
        const blocksData = await fetchBlocks(selectedProject.id);
        setBlocks(blocksData);

        const iconsDataPromises = blocksData.map((block) =>
          fetchIcons(block.id).then((icons) => ({ blockId: block.id, icons }))
        );
        const iconsDataResults = await Promise.all(iconsDataPromises);

        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
        setEditingProjectName(selectedProject.name);
        setEditingProjectDescription(selectedProject.description);
      } catch (error) {
        console.error("プロジェクト詳細データの取得に失敗しました:", error);
      }
    };

    fetchProjectDetails();
  }, [selectedProject]);


 // CRUD

 const handleUpdateProject = async () => {
  if (!selectedProject) {
    console.error("Error: No project selected.");
    return;
  }

  // 確認ダイアログを表示
  const isConfirmed = window.confirm("更新します、よろしいですか？");
  if (!isConfirmed) {
    console.log("更新がキャンセルされました。");
    return;
  }

  try {
    // 1. プロジェクト情報を更新
    console.log("Updating project with ID:", selectedProject.id);
    const updatedProject = await updateProject(selectedProject.id, {
      name: editingProjectName,
      description: editingProjectDescription,
    });
    console.log("Project updated successfully:", updatedProject);

    // 2. 削除対象のアイコンを一括削除
    if (deletedIconIds.length > 0) {
      console.log("Deleting icons:", deletedIconIds);
      for (const { iconId, blockId } of deletedIconIds) {
        try {
          await deleteIcon(blockId, iconId);
          console.log(`アイコン削除成功: blockId=${blockId}, iconId=${iconId}`);
        } catch (deleteError) {
          console.error(
            `Failed to delete icon (blockId=${blockId}, iconId=${iconId}):`,
            deleteError.response?.data || deleteError.message
          );
        }
      }
    } else {
      console.log("No icons to delete.");
    }

    // 3. 状態をクリアしてUIを更新
    setDeletedIconIds([]);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setSelectedProject(updatedProject);

    // 完了メッセージを表示
    alert("更新が完了しました。");

    // /edit ページにリダイレクト
    window.location.href = "/edit";

    console.log("Project and icons update completed successfully.");
  } catch (error) {
    console.error(
      "An error occurred during the update process:",
      error.response?.data || error.message
    );
  }
};


  // const handleCreateBlock = async () => {
  //   if (!newBlockName || !selectedProject) return;
  //   try {
  //     const newBlock = await createBlock(selectedProject.id, { tag_name: newBlockName });
  //     setBlocks((prev) => [...prev, newBlock]);
  //     setNewBlockName("");
  //   } catch (error) {
  //     console.error("ブロックの作成に失敗しました:", error);
  //   }
  // };

  const handleCreateIcon = async (blockId) => {
    if (!newIconName) return;
  
    try {
      // アイコンの存在を確認
      const iconData = await validateIcon(newIconName);
      if (!iconData) {
        alert("アイコンが存在しません。正しい名前を入力してください。");
        return;
      }
  
      // アイコンを追加
      const newIcon = await createIcon(blockId, {
        name: iconData.name,
        image_url: iconData.image_url,
      });
  
      // UIを更新
      setBlockIconsMap((prev) => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), newIcon],
      }));
      setNewIconName("");
      console.log("アイコンが追加されました:", newIcon);
    } catch (error) {
      console.error("アイコンの作成に失敗しました:", error);
    }
  };
  


  const handleDeleteIcon = (iconId, blockId) => {
    if (!iconId || !blockId) return;
  
    try {
      // ローカル状態から削除
      setBlockIconsMap((prev) => {
        const newBlockIconsMap = { ...prev };
        newBlockIconsMap[blockId] = newBlockIconsMap[blockId].filter(
          (icon) => icon.id !== iconId
        );
        return newBlockIconsMap;
      });
  
      // 削除対象アイコンをリストに追加
      setDeletedIconIds((prev) => [...prev, { iconId, blockId }]);
  
      onClose();
    } catch (error) {
      console.error("アイコン削除処理でエラーが発生しました:", error);
    }
  };
  


  const handleIconClick = (icon) => {
    setSelectedIcon(icon); // 選択されたアイコンを設定
    onOpen(); // モーダルを開く
  };
  
  
  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" p={6} bg="gray.50" height="100vh" overflowY="auto">
      <VStack align="start" spacing={6}>
        <Box width="100%">
          <Heading as="h2" size="lg" mb={4}>
            プロジェクト一覧
          </Heading>
          <List spacing={3}>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                cursor="pointer"
                bg={selectedProject?.id === project.id ? "teal.100" : "white"}
                p={2}
                borderRadius="md"
                onClick={() => {
                  if (selectedProject?.id === project.id) {
                    setSelectedProject(null);
                  } else {
                    setSelectedProject(project);
                  }
                }}
              >
                {project.name}
              </ListItem>
            ))}
          </List>
          <Box width="100%" mt={6}>
            {/* 新規プロジェクト作成ボタン */}
            <Button
              colorScheme="teal"
              _hover={{ textDecoration: "none" }} // ホバー時の下線を削除
              onClick={() => setIsAddingNewProject((prev) => !prev)} // フォームの表示/非表示を切り替え
            >
              {isAddingNewProject ? "閉じる" : "新規プロジェクト作成"}
            </Button>

            {/* 新規プロジェクト作成フォーム */}
            {isAddingNewProject && (
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="sm"
                bg="white"
                width="100%"
                mt={4}
              >
                <Heading as="h3" size="md" mb={4}>
                  新規プロジェクト作成
                </Heading>
                <FormControl mb={4}>
                  <FormLabel>プロジェクト名</FormLabel>
                  <Input
                    placeholder="プロジェクト名を入力"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </FormControl>
                {/* タグ名フォーム */}
                <FormControl mb={4}>
                  <FormLabel>タグ名</FormLabel>
                  <Input
                    placeholder="タグ名を入力"
                    value={newBlockName}
                    onChange={(e) => setNewBlockName(e.target.value)}
                  />
                </FormControl>
                {/* アイコン名フォーム */}
                <FormControl mb={4}>
                  <FormLabel>アイコン名</FormLabel>
                  <Input
                    placeholder="アイコン名を入力"
                    value={newIconName}
                    onChange={(e) => setNewIconName(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>説明</FormLabel>
                  <Input
                    placeholder="説明を入力"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </FormControl>
                <Button colorScheme="teal" onClick={handleCreateProject}>
                  作成する
                </Button>
              </Box>
            )}
          </Box>
        </Box>


        {/* プロジェクト編集 */}
        {selectedProject && (
          <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" width="100%">
            <Heading as="h3" size="md" mb={4}>
              プロジェクト編集
            </Heading>
            <FormControl mb={2}>
              <FormLabel>プロジェクト名</FormLabel>
              <Input
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>説明</FormLabel>
              <Input
                value={editingProjectDescription}
                onChange={(e) => setEditingProjectDescription(e.target.value)}
              />
            </FormControl>
            {/* タグとアイコン編集 */}
            <Heading as="h3" size="md" mt={8} mb={4}>
              ブロック編集
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {blocks.map((block) => (
              <Box key={block.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                <Heading as="h4" size="sm" mb={4}>
                  {block.tag_name}
                </Heading>
                <SimpleGrid columns={2} spacing={2}>
                  {blockIconsMap[block.id]?.map((icon) => (
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
                      onClick={() => handleIconClick(icon)} // クリック時にアイコン選択関数を実行
                    >
                      <Text mb={1}>{icon.name}</Text>
                      {/* アイコン画像 */}
                      <Box
                        mb={1}
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
                    </Box>
                  ))}
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel>アイコンの追加</FormLabel>
                  <Input
                    placeholder="アイコン名を入力"
                    value={newIconName}
                    onChange={(e) => setNewIconName(e.target.value)}
                  />
                  <Button
                    colorScheme="teal"
                    mt={2}
                    onClick={() => handleCreateIcon(block.id)}
                  >
                    アイコンを追加
                  </Button>
                </FormControl>
              </Box>
            ))}
          </SimpleGrid>

            {/* <FormControl mt={4}>
                  <Heading as="h4" size="sm" mb={4}>
                    ブロックの追加
                  </Heading>              <Input
                placeholder="例）進捗管理"
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)}
              />
              <Button colorScheme="teal" mt={2} onClick={handleCreateBlock}>
                タグを追加
              </Button>
            </FormControl> */}
          </Box>
        )}
      </VStack>
      {selectedProject && (
        <Flex justifyContent="center" alignItems="center" mt={5}>
          <Button
            colorScheme="blue"
            size="lg"
            height="20px" 
            width="60%"
            py={6} 
            onClick={handleUpdateProject} // 必要に応じて適切な関数を呼び出す
          >
            更新
          </Button>
        </Flex>
     )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt="100px">
          <ModalHeader>アイコン削除確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedIcon?.name} を削除しますか？</Text>
          </ModalBody>
          <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => handleDeleteIcon(selectedIcon?.id, selectedIcon?.block_id)}
          >
            削除
          </Button>

            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>




    </Flex>
  );
};

export default EditPage;
