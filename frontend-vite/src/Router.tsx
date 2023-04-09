import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatGPT from './pages/chatgpt';
import App from './pages/App';
import NotFound from './pages/NotFound';
import './assets/styles/Router.css';
import MyNavbar from './components/Navbar';
import Login from './pages/Login';

export default function Router() {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  return (
    <BrowserRouter>
      <MyNavbar title="CATastrophe" titleLink="/">
        <Link to="/" onClick={() => handleLinkClick('/')}>
          Home
        </Link>
        <Link to="/chat" onClick={() => handleLinkClick('/chat')}>
          Chat
        </Link>
        <Link to="/login" onClick={() => handleLinkClick('/login')}>
          Login
        </Link>
      </MyNavbar>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatGPT />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
