// src/app/components/IconDetails.jsx
'use client';

import React from 'react';
import { Box, Heading, Image, Text, Link, Button } from '@chakra-ui/react';

const ClickOpen = ({ icon }) => {
  const handleOpenUrl = () => {
    window.open(icon.url, '_blank');
  };

  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
      <Heading as="h2" size="lg" mb={4}>
        {icon.name}の詳細
      </Heading>
      <Box textAlign="center" mb={4}>
        <Image
          src={icon.imageUrl}
          alt={icon.name}
          boxSize="100px"
          objectFit="cover"
          mx="auto"
        />
      </Box>
      <Text fontSize="md" mb={4}>
        <strong>URL:</strong>{' '}
        <Link href={icon.url} isExternal color="teal.500">
          {icon.url}
        </Link>
      </Text>
      <Button colorScheme="teal" onClick={handleOpenUrl}>
        ウェブサイトを開く
      </Button>
    </Box>
  );
};

export default ClickOpen;
