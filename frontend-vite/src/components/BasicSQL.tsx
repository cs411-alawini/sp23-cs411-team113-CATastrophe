import styles from '../assets/styles/BasicSQL.module.css';
import { useState, useEffect } from 'react';
import React from 'react';

function BasicSQL() {
  const [count, setCount] = useState(0);
  const [serverMessage, setServerMessage] = useState('Hello world 0');
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    if (count > 0) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/data?count=${count}`)
        .then((response) => response.json())
        .then((data) => setServerMessage(data.message))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [count]);

  const fetchSchools = () => {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
        setLoadingSchools(false);
      })
      .catch((error) => {
        console.error('Error fetching schools data:', error);
        setLoadingSchools(false);
      });
  };

  const renderSkeleton = () => {
    return (
      <li>
        <span className="skeleton-text" style={{ width: '200px' }}></span>
      </li>
    );
  };

  return (
    <div>

      <h1 className={styles.heading}>College Recommendation</h1>

        <button onClick={() => setCount(count + 1)}>
          count is {count}
        </button>

      <p><b>This message is from server: {serverMessage}</b></p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <button onClick={fetchSchools}>Get Schools</button>
      <ul>
        {loadingSchools
          ? Array.from({ length: 10 }).map((_, index) => (
              <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
            ))
          : schools.map((school: any, index: number) => (
              <li key={index}>
                {school.Name} - {school.State} (Enrollment: {school.TotalEnrollment})
              </li>
            ))}
      </ul>
    </div>
  );
}

export default BasicSQL;
