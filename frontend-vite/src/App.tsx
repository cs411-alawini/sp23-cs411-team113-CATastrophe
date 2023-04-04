import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [serverMessage, setServerMessage] = useState('Hello world 0');

  useEffect(() => {
    if (count > 0) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/data?count=${count}`)
        .then((response) => response.json())
        .then((data) => setServerMessage(data.message))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [count]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p><b>This message is from server: {serverMessage}</b></p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
