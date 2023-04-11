import { useState } from 'react';
import styles from '../assets/styles/chatgpt.module.css';

function ChatGPT() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
    setMessages([...messages, `User: ${inputMessage}`]);
  
    try {
      const formattedMessages = messages.map((message, index) => {
        const role = message.startsWith('User:') ? 'user' : 'assistant';
        const content = message.slice(role === 'user' ? 6 : 5);
        return { role, content };
      });
  
      formattedMessages.push({ role: 'user', content: inputMessage });
  
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedMessages,
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
    <div className={styles.chatgptContainer}>
      <h2 className={styles.chatgptTitle}>ChatGPT</h2>
      <div className={styles.chatgptMessages}>
        {messages.map((message, index) => (
          <p key={index} className={styles.chatgptMessage}>
            {message}
          </p>
        ))}
      </div>
      <div className={styles.chatgptInputContainer}>
        <input
          className={styles.chatgptInput}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message and hit Enter to send"
        />
        <button className={styles.chatgptSendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
    
  );
}

export default ChatGPT;
