import UIUClogo from '../assets/images/UIUC-logo.png';
import reactLogo from '../assets/images/react.svg';
import nodeLogo from '../assets/images/node-logo.png';

function TechStack() {
  return (
    <div>
      <a href="https://illinois.edu/" target="_blank">
        <img src={UIUClogo} className="logo" alt="Vite logo" style={{height: '100px' }}/>
      </a>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" style={{height: '70px' }}/>
      </a>
      <a href="https://reactjs.org" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" style={{height: '70px' }}/>
      </a>
      <a href="https://nodejs.org" target="_blank">
        <img src={nodeLogo} className="logo react" alt="React logo" style={{height: '70px', marginLeft: '10px'}}/>
      </a>
    </div>
  )
}

export default TechStack;