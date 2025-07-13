import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Avaliacao from './pages/Avaliacao'
import RH from './pages/RH';
import Comite from './pages/Comite';
import Gestor from './pages/Gestor'
import Dashboard from './pages/Dashboard'
import EvaluationDetailPage from './components/EvaluationDetailPage/EvaluationDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/* redireciona raiz pra login */}
          <Route index element={<Navigate to="/login" replace />} />
         <Route path="/home" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/avaliacao/:section" element={<Avaliacao />} />
         <Route path="/RH" element= {<RH />} />
         <Route path="/Comite" element={<Comite />} />
         <Route path="/Gestor" element={<Gestor />} />
          <Route
            path="/gestor/brutalfact"
            element={<EvaluationDetailPage />}
          />
         <Route path="/Dashboard" element={<Dashboard />} />
          {/* qualquer outra URL também cai no login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;
