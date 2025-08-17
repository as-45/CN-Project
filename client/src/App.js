import './App.css';
import React from 'react';
import Home from './component/Home.js';
import {Routes,Route} from 'react-router-dom';
import EditorPage from './component/EditorPage.js';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position="top-center"></Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/editor/:roomId' element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
