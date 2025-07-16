import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Avaliacao from './pages/Evaluation/Evaluation'
import RH from './pages//RH/RH';
import Comite from './pages/Committee/Committee';
import Gestor from './pages/Manager/Manager'
import Dashboard from './pages/Dashboard/Dashboard'
import EvaluationDetailPage from './pages/Evaluation/components/EvaluationDetailPage';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/avaliacao/:section" element={<Avaliacao />} />
        <Route path="/RH" element={<RH />} />
        <Route path="/Comite" element={<Comite />} />
        <Route path="/Gestor" element={<Gestor />} />
        <Route
          path="/gestor/brutalfact"
          element={<EvaluationDetailPage />}
        />
        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
