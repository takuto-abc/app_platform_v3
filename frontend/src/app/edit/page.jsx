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

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectDescription) return;
    try {
      const newProject = await createProject({
        name: newProjectName,
        description: newProjectDescription,
      });
      setProjects((prev) => [...prev, newProject]);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      console.error("新規プロジェクトの作成に失敗しました:", error);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    try {
      const updatedProject = await updateProject(selectedProject.id, {
        name: editingProjectName,
        description: editingProjectDescription,
      });
      setProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      setSelectedProject(updatedProject);
    } catch (error) {
      console.error("プロジェクトの更新に失敗しました:", error);
    }
  };

  const handleCreateBlock = async () => {
    if (!newBlockName || !selectedProject) return;
    try {
      const newBlock = await createBlock(selectedProject.id, { tag_name: newBlockName });
      setBlocks((prev) => [...prev, newBlock]);
      setNewBlockName("");
    } catch (error) {
      console.error("ブロックの作成に失敗しました:", error);
    }
  };

  const handleCreateIcon = async (blockId) => {
    if (!newIconName || !newIconUrl) return;
    try {
      const newIcon = await createIcon(blockId, {
        name: newIconName,
        image_url: newIconUrl,
      });
      setBlockIconsMap((prev) => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), newIcon],
      }));
      setNewIconName("");
      setNewIconUrl("");
    } catch (error) {
      console.error("アイコンの作成に失敗しました:", error);
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
            {/* <Button colorScheme="teal" mt={4} onClick={handleUpdateProject}>
              プロジェクトを更新
            </Button> */}

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
                      placeholder="例）ウェルスナビ"
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
            <FormControl mt={4}>
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
            </FormControl>
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
    </Flex>
  );
};

export default EditPage;
