import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './client/Main';
import Login from './login';
import Register from './register';
import Home from './homepage/home';
import Admin from './admin/admin';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/Main" element={<Main/>} />
      
    </Routes>
  );
}

export default App;