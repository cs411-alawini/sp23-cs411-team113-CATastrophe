// import '@/assets/styles/chatgpt.css';
import '../assets/styles/chatgpt.css';
import { useState } from 'react';

function ChatGPT() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
    setMessages([...messages, `User: ${inputMessage}`]);
    
    try {

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputMessage 
        }),
      });
      
      // Check if the response is OK and log the response if there's an issue
      if (!response.ok) {
        console.error('Server responded with an error:', response);
        return;
      }
  
      const data = await response.json();
      setMessages((msgs) => [...msgs, `GPT: ${data.response}`]);
    } catch (error) {
      console.error('Error:', error);
    }
  
    setInputMessage('');
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };
  
  return (
    <div className="chatgpt-container">
      <h2 className="chatgpt-title">ChatGPT</h2>
      <div className="chatgpt-messages">
        {messages.map((message, index) => (
          <p key={index} className="chatgpt-message">{message}</p>
        ))}
      </div>
      <div className="chatgpt-input-container">
        <input
          className="chatgpt-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message and hit Enter to send"
        />
        <button className="chatgpt-send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatGPT;
