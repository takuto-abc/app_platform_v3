// pages/_app.jsx
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Header from '../components/layout/header/page';
import Footer from '../components/layout/footer/page';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <div style={styles.container}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </ChakraProvider>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
};

export default App;
