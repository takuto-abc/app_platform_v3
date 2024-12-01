// src/app/pages/app.jsx
import React from 'react';
import Header from "../components/layout/header/page";
import Main from '../components/layout/main/Main';
import Footer from "../components/layout/footer/page";

const App = () => {
  return (
    <div style={styles.container}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
};

export default App;
