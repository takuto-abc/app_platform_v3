// app/layout.jsx
"use client";

import { ChakraProvider } from '@chakra-ui/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
