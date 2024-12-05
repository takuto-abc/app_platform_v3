// src/app/components/SearchBar.jsx
'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Button,
  Text,
  Spinner,
  Flex,
  useOutsideClick,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBar = ({ onSelectProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // 外部クリックを検知してドロップダウンを閉じる
  useOutsideClick({
    ref: wrapperRef,
    handler: () => setShowDropdown(false),
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      // プロジェクトのフィルタリング（例として既存のプロジェクトを使用）
      const projects = ['旅行', '就職活動', 'ゼミの論文作成'];
      const filtered = projects.filter((project) =>
        project.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProjects(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (project) => {
    onSelectProject(project);
    setSearchTerm(''); // 検索バーをクリア
    setShowDropdown(false); // ドロップダウンを閉じる
  };

  return (
    <Box position="relative" mb={4} ref={wrapperRef}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="プロジェクトを検索"
          value={searchTerm}
          onChange={handleChange}
          bg="white"
        />
      </InputGroup>
      {showDropdown && filteredProjects.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          maxHeight="150px"
          overflowY="auto"
          zIndex={10}
          mt={2}
        >
          <List spacing={0}>
            {filteredProjects.map((project) => (
              <ListItem key={project}>
                <Button
                  variant="ghost"
                  width="100%"
                  justifyContent="flex-start"
                  onClick={() => handleSelect(project)}
                >
                  {project}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {showDropdown && filteredProjects.length === 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          p={4}
          zIndex={10}
          mt={2}
        >
          <Text color="gray.500">該当するプロジェクトがありません。</Text>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
