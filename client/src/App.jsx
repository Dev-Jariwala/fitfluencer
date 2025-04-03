import React from 'react'
import { Toaster } from 'react-hot-toast'
import Routes from './routes/Routes';

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes />
    </>
  );
};

export default App