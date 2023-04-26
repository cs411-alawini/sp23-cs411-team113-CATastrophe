import { useState, useEffect } from 'react';
import styles from '../assets/styles/chatgpt.module.css';

function ChatGPT() {
  // Retrieve chat history from localStorage or set it to an empty array if it doesn't exist
  const [messages, setMessages] = useState<string[]>(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const [inputMessage, setInputMessage] = useState('');

  const clearMessages = () => {
    setMessages([]);
  };

  
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent a newline from being added
      sendMessage();
    }
  };

  return (
    <>
      <div className={styles.chatgptContainer}>
        <h2 className={styles.chatgptTitle}>Ask any question about colleges!</h2>
        <div className={styles.chatgptMessages}>
          {messages.map((message, index) => (
            <div key={index} className={styles.chatgptMessage}>
              <span className={styles.chatgptLabel}>{message.startsWith('User:') ? 'User:' : 'GPT:'}</span>
              <span className={styles.chatgptContent}>{message.slice(message.startsWith('User:') ? 6 : 5)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chatgptInputContainer}>
        <textarea
          className={styles.chatgptInput}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message and hit Enter to send"
          rows={3}
        />

        <div className={styles.chatgptButtons}>
          <button className={styles.chatgptClearButton} onClick={clearMessages}>
            Clear
          </button>
          <button className={styles.chatgptSendButton} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
  
}

export default ChatGPT;
