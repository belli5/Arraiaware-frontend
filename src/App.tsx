import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Avaliacao from './pages/Avaliacao'
import AvaliacaoLideres from './pages/AvaliacaoLideres'
import RH from './pages/RH';
import Comite from './pages/Comite';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/avaliacao/:section" element={<Avaliacao />} />
        <Route path="/avaliacaoLideres" element={<AvaliacaoLideres />} />
        <Route path="/RH" element= {<RH />} />
        <Route path="/Comite" element={<Comite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
