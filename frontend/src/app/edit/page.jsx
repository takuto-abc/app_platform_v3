"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  Button,
  IconButton,
  List,
  ListItem,
  SimpleGrid,
  Link,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
  const [newTags, setNewTags] = useState([{ id: Date.now(), name: "" }]); // タグリストを管理
  const [newIconName, setNewIconName] = useState(""); 
  const [newIconNamesMap, setNewIconNamesMap] = useState({});
  const [newIconUrl, setNewIconUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddingNewProject, setIsAddingNewProject] = useState(false); // フォームの開閉管理
  const [selectedIcon, setSelectedIcon] = useState(null); // 選択されたアイコン
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの開閉状態
  const [deletedIconIds, setDeletedIconIds] = useState([]);
  const [suggestedIcons, setSuggestedIcons] = useState([]); // アイコン候補
  const [suggestedIconsMap, setSuggestedIconsMap] = useState({});
  const toast = useToast(); // Chakra UI の Toast フック
  const [isSubmitting, setIsSubmitting] = useState(false); // ローディング制御



  // データフェッチ

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const projectData = await fetchProjects();
        console.log("取得したプロジェクトデータ:", projectData);
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
      if (!selectedProject) {
        console.warn("selectedProject が null または未定義です");
        return;
      }
  
      try {
        console.log("プロジェクト詳細取得開始: ", selectedProject);
  
        // ブロックデータの取得
        const blocksData = await fetchBlocks(selectedProject.id);
        console.log("取得したブロックデータ:", blocksData);
        setBlocks(blocksData);
  
        // アイコンデータの取得
        const iconsDataPromises = blocksData.map((block) => {
          console.log("ブロックID:", block.id);
          return fetchIcons(block.id)
            .then((icons) => {
              return { blockId: block.id, icons };
            })
            .catch((error) => {
              console.warn(`fetchIcons エラー (blockId: ${block.id}):`, error);
              return { blockId: block.id, icons: [] }; // エラー発生時は空の配列を返す
            });
        });
  
        const iconsDataResults = await Promise.all(iconsDataPromises);
        console.log("全てのアイコンデータ:", iconsDataResults);
  
        // ブロックとアイコンのマッピング
        const newBlockIconsMap = {};
        iconsDataResults.forEach(({ blockId, icons }) => {
          newBlockIconsMap[blockId] = icons;
        });
        setBlockIconsMap(newBlockIconsMap);
  
        // プロジェクト情報を編集用にセット
        setEditingProjectName(selectedProject.name);
        setEditingProjectDescription(selectedProject.description);
        console.log("編集用データ設定完了");
      } catch (error) {
        console.error("プロジェクト詳細データの取得に失敗しました:", error);
      }
    };
  
    fetchProjectDetails();
  }, [selectedProject]);
  



 // CRUD
 const handleCreateProject = async () => {
  setIsSubmitting(true);
  try {
    const tagNames = newTags.map((tag) => tag.name).filter((name) => name.trim() !== "");
    if (!newProjectName || !newProjectDescription || tagNames.length === 0) {
      toast({
        title: "入力エラー",
        description: "すべてのフィールドを入力してください。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    // プロジェクト作成APIを呼び出し
    const response = await createProject({
      name: newProjectName,
      description: newProjectDescription,
      tags: tagNames, // タグ名を送信
    });

    console.log("作成されたプロジェクト:", response);

    toast({
      title: "作成が完了しました。",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // `/edit` に遷移
    setTimeout(() => {
      window.location.href = "/edit";
    }, 3000);
  } catch (error) {
    console.error("プロジェクト作成に失敗しました:", error);
    toast({
      title: "作成に失敗しました。",
      description: "もう一度お試しください。",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsSubmitting(false);
  }
};



 const handleUpdateProject = async () => {
  if (!selectedProject) {
    console.error("Error: No project selected.");
    return;
  }

  const isConfirmed = window.confirm("更新します、よろしいですか？");
  if (!isConfirmed) {
    console.log("更新がキャンセルされました。");
    return;
  }

  try {
    console.log("Updating project with ID:", selectedProject.id);
    const updatedProject = await updateProject(selectedProject.id, {
      name: editingProjectName,
      description: editingProjectDescription,
    });

    if (deletedIconIds.length > 0) {
      console.log("Deleting icons:", deletedIconIds);
      for (const { iconId, blockId } of deletedIconIds) {
        await deleteIcon(blockId, iconId);
      }
    }

    // 最新データを取得
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

    setDeletedIconIds([]);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    setSelectedProject(updatedProject);

    alert("更新が完了しました。");
    window.location.href = "/edit";
    // console.log("Project and icons update completed successfully.");
  } catch (error) {
    console.error("An error occurred during the update process:", error.response?.data || error.message);
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


  const handleCreateIcon = async (blockId, selectedIcon) => {
    try {
      const newIcon = await createIcon(blockId, {
        name: selectedIcon.name,
        image_url: selectedIcon.image_url,
      });
  
      setBlockIconsMap((prev) => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), newIcon],
      }));
  
      // 入力値と候補をクリア
      setNewIconNamesMap((prev) => ({
        ...prev,
        [blockId]: {
          iconName: "",
        },
      }));
      setSuggestedIconsMap((prev) => ({
        ...prev,
        [blockId]: [],
      }));
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


  const handleTagChange = (id, value) => {
    setNewTags((prevTags) =>
      prevTags.map((tag) => (tag.id === id ? { ...tag, name: value } : tag))
    );
  };

  const handleAddTag = () => {
    setNewTags((prevTags) => [...prevTags, { id: Date.now(), name: "" }]);
  };

  const handleRemoveTag = (id) => {
    setNewTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };
  
  const handleIconInputChange = async (inputValue, blockId) => {
    // 各ブロックに紐付けた入力値を保存
    setNewIconNamesMap((prev) => ({
      ...prev,
      [blockId]: {
        iconName: inputValue, // 入力値を保存
      },
    }));
  
    if (!inputValue.trim()) {
      // 入力が空の場合、該当ブロックの候補をリセット
      setSuggestedIconsMap((prev) => ({
        ...prev,
        [blockId]: [],
      }));
      return;
    }
  
    try {
      // APIで候補アイコンを取得
      const suggestions = await validateIcon(inputValue);
  
      // 頭文字に一致するアイコンだけをフィルタリングし、重複を排除
      const filteredSuggestions = suggestions
        .filter((icon) => icon.name.toLowerCase().startsWith(inputValue.toLowerCase()))
        .filter(
          (icon, index, self) =>
            index === self.findIndex((t) => t.name === icon.name)
        );
  
      // 該当ブロックの候補リストを更新
      setSuggestedIconsMap((prev) => ({
        ...prev,
        [blockId]: filteredSuggestions,
      }));
    } catch (error) {
      toast({
        title: "エラー",
        description: "アイコン候補の取得に失敗しました。再度お試しください。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // エラー時も該当ブロックの候補をリセット
      setSuggestedIconsMap((prev) => ({
        ...prev,
        [blockId]: [],
      }));
    }
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




            {/* 新規プロジェクト作成 */}
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
                <FormControl mb={4}>
                  <FormLabel>タグ名</FormLabel>
                  {newTags.map((tag, index) => (
                    <HStack key={tag.id} mb={2}>
                      <Input
                        placeholder={`タグ ${index + 1}`}
                        value={tag.name}
                        onChange={(e) => handleTagChange(tag.id, e.target.value)}
                      />
                      {newTags.length > 1 && (
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="タグを削除"
                          onClick={() => handleRemoveTag(tag.id)}
                          colorScheme="red"
                        />
                      )}
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddTag}
                    size="sm"
                    variant="outline"
                    mt={2}
                  >
                    タグを追加
                  </Button>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>説明</FormLabel>
                  <Input
                    placeholder="説明を入力"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  />
                </FormControl>
                <Flex justifyContent="flex-end">
                  <Button colorScheme="teal" onClick={handleCreateProject}>
                    作成する
                  </Button>
                </Flex>
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
                    value={newIconName} // 状態をバインド
                    onChange={(e) => setNewIconName(e.target.value)} // 入力値を状態に保存
                  />
                  <Box mt={2}>
                    {suggestedIconsMap[block.id]?.length > 0 && ( // 該当ブロックの候補のみ表示
                      <List spacing={2}>
                        {suggestedIconsMap[block.id].map((icon) => (
                          <ListItem
                            key={icon.id}
                            cursor="pointer"
                            onClick={() => handleCreateIcon(block.id, icon)} // 候補を選択して追加
                          >
                            <Flex alignItems="center">
                              <img
                                src={icon.image_url}
                                alt={icon.name}
                                width="24"
                                height="24"
                                style={{ marginRight: "8px" }}
                              />
                              <Text>{icon.name}</Text>
                            </Flex>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
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
