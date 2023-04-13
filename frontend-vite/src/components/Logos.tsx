import UIUClogo from '../assets/images/UIUC-logo.png';
import reactLogo from '../assets/images/react-logo.svg';
import nodeLogo from '../assets/images/node-logo.png';
import mySQLLogo from '../assets/images/mysql-logo.png';

import styles from '../assets/styles/Logos.module.css';

function Logos() {
  return (
    <div className={styles.logosContainer}>
      <a href="https://illinois.edu/" target="_blank">
        <img src={UIUClogo} className="logo" alt="Illinois logo" style={{height: '100px' }}/>
      </a>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" style={{height: '70px' }}/>
      </a>
      <a href="https://reactjs.org" target="_blank">
        <img src={reactLogo} className="logo" alt="React logo" style={{height: '70px' }}/>
      </a>
      <a href="https://nodejs.org" target="_blank">
        <img src={nodeLogo} className="logo" alt="Nodejs logo" style={{height: '70px', marginLeft: '10px'}}/>
      </a>
      <a href="https://www.mysql.com" target="_blank">
        <img src={mySQLLogo} className="logo" alt="MySQL logo" style={{height: '70px', marginLeft: '10px'}}/>
      </a>
    </div>
  )
}

export default Logos;