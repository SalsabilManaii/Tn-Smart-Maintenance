import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './client/Main';
import Login from './login';
import Register from './register';
import Home from './homepage/home';
import Technicien from './Technicien/Technicien';
import Responsable from "./Responsable/Responsable";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/responsable" element={<Responsable />} />
      <Route path="/Technicien" element={<Technicien />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/Main" element={<Main/>} />
      
    </Routes>
  );
}

export default App;