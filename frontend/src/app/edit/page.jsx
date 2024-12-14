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
            <Button colorScheme="teal" mt={4} onClick={handleUpdateProject}>
              プロジェクトを更新
            </Button>

            {/* タグとアイコン編集 */}
            <Heading as="h3" size="md" mt={8} mb={4}>
              タグとアイコン
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {blocks.map((block) => (
                <Box key={block.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
                  <Heading as="h4" size="sm" mb={4}>
                    {block.tag_name}
                  </Heading>
                  <SimpleGrid columns={2} spacing={2}>
                    {blockIconsMap[block.id]?.map((icon) => (
                      <Box key={icon.id}>
                        <Text>{icon.name}</Text>
                        <Input
                          value={icon.image_url}
                          onChange={(e) =>
                            handleUpdateIcon({ ...icon, image_url: e.target.value })
                          }
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                  <FormControl mt={4}>
                    <FormLabel>新規アイコン</FormLabel>
                    <Input
                      placeholder="アイコン名"
                      value={newIconName}
                      onChange={(e) => setNewIconName(e.target.value)}
                    />
                    <Input
                      placeholder="アイコンURL"
                      mt={2}
                      value={newIconUrl}
                      onChange={(e) => setNewIconUrl(e.target.value)}
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
              <FormLabel>新規タグ</FormLabel>
              <Input
                placeholder="タグ名"
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
    </Flex>
  );
};

export default EditPage;
