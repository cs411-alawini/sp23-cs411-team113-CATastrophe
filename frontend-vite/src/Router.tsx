import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatGPT from './components/chatgpt';
import App from './App';
import NotFound from './pages/NotFound';
import './assets/styles/Router.css';
import MyNavbar from './components/Navbar';

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
      </MyNavbar>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatGPT />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
