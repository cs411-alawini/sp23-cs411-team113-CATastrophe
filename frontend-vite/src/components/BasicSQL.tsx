import styles from '../assets/styles/BasicSQL.module.css';
import { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Box } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function BasicSQL() {
  const [count, setCount] = useState(0);
  const [serverMessage, setServerMessage] = useState('Hello world 0');
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [operation, setOperation] = useState('');
  const [inputValues, setInputValues] = useState({
    name: '',
    state: '',
    enrollment: '',
  });

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

  const handleOperationClick = (operation: string) => {
    setOperation(operation);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setInputValues({
      ...inputValues,
      [field]: event.target.value,
    });
  };

  const handleOperationSubmit = () => {
    if (operation === 'getAll') {
      fetchSchools();
    } else if (operation === 'get') {
      setLoadingSchools(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/${inputValues.name}`)
        .then((response) => response.json())
        .then((data) => {
          setSchools(data);
          setLoadingSchools(false);
        })
        .catch((error) => {
          console.error('Error fetching school data:', error);
          setLoadingSchools(false);
        });
    } else if (operation === 'post') {
      setLoadingSchools(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: inputValues.name,
          State: inputValues.state,
          TotalEnrollment: parseInt(inputValues.enrollment),
        }),
      })
        .then((response) => response.json())
        .then(() => {
          fetchSchools();
        })
        .catch((error) => {
          console.error('Error creating school:', error);
          setLoadingSchools(false);
        });
    } else if (operation === 'put') {
      setLoadingSchools(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/${inputValues.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          State: inputValues.state,
          TotalEnrollment: parseInt(inputValues.enrollment),
        }),
      })
      .then((response) => response.json())
      .then(() => {
        fetchSchools();
      })
      .catch((error) => {
        console.error('Error updating school:', error);
        setLoadingSchools(false);
      });
  } else if (operation === 'delete') {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/${inputValues.name}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        fetchSchools();
      })
      .catch((error) => {
        console.error('Error deleting school:', error);
        setLoadingSchools(false);
      });
  }
};

const renderSkeleton = () => {
  return (
    <li>
      <span className="skeleton-text" style={{ width: '200px' }}></span>
    </li>
  );
};


const renderTable = () => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Total Enrollment</TableCell>
          <TableCell align="right">State</TableCell>
          <TableCell align="right">State Salary Rank</TableCell>
          <TableCell align="right">Early Career Pay</TableCell>
          <TableCell align="right">Mid Career Pay</TableCell>
          <TableCell align="right">STEM Percent</TableCell>
          <TableCell align="right">Type</TableCell>
          <TableCell align="right">Degree Length</TableCell>
          <TableCell align="right">Board Cost</TableCell>
          <TableCell align="right">In-State Tuition</TableCell>
          <TableCell align="right">Out-State Tuition</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {schools.map((school: any, index: number) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {school.Name}
            </TableCell>
            <TableCell align="right">{school.TotalEnrollment}</TableCell>
            <TableCell align="right">{school.State}</TableCell>
            <TableCell align="right">{school.StateSalaryRank}</TableCell>
            <TableCell align="right">{school.EarlyCareerPay}</TableCell>
            <TableCell align="right">{school.MidCareerPay}</TableCell>
            <TableCell align="right">{school.STEMPercent}</TableCell>
            <TableCell align="right">{school.Type}</TableCell>
            <TableCell align="right">{school.DegreeLength}</TableCell>
            <TableCell align="right">{school.BoardCost}</TableCell>
            <TableCell align="right">{school.InStateTuition}</TableCell>
            <TableCell align="right">{school.OutStateTuition}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);



return (
  <div>
    <h1 className={styles.heading}>College Recommendation</h1>
    <Button variant="secondary" onClick={() => setCount(count + 1)}>
      count is {count}
    </Button>
    <p>
      <b>This message is from server: {serverMessage}</b>
    </p>
    <Button variant="primary" onClick={() => handleOperationClick('getAll')}>
      Get All Schools
    </Button>
    <Button variant="primary" onClick={() => handleOperationClick('get')}>
      Get School By Name
    </Button>
    <Button variant="primary" onClick={() => handleOperationClick('post')}>
      Create School
    </Button>
    <Button variant="primary" onClick={() => handleOperationClick('put')}>
      Update School
    </Button>
    <Button variant="primary" onClick={() => handleOperationClick('delete')}>
      Delete School
    </Button>
    {operation && (
      <div className="mt-3">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="School Name"
            onChange={(event) => handleInputChange(event, 'name')}
          />
          {operation !== 'get' && operation !== 'delete' && (
            <>
              <FormControl
                placeholder="State"
                onChange={(event) => handleInputChange(event, 'state')}
              />
              <FormControl
                placeholder="Total Enrollment"
                onChange={(event) => handleInputChange(event, 'enrollment')}
              />
            </>
          )}
          <Button variant="outline-secondary" id="button-addon2" onClick={handleOperationSubmit}>
            Submit
          </Button>
        </InputGroup>
      </div>
    )}
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

