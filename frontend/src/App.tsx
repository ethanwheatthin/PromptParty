import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Host from './pages/Host';
import Player from './pages/Player';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host/:roomId" element={<Host />} />
        <Route path="/play/:roomId" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
