import styles from '../assets/styles/BasicSQL.module.css';
import { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Box } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function BasicSQL() {

  // //////////[ School, State related stats ]//////////
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem('count');
    return storedCount ? parseInt(storedCount) : 0;
  });
  const [serverMessage, setServerMessage] = useState('');
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [operation, setOperation] = useState('');
  const [inputValues, setInputValues] = useState({
    // schools
    name: '',
    state: '',
    enrollment: '',
    stateSalaryRank: '',
    earlyCareerPay: '',
    midCareerPay: '',
    stemPercent: '',
    type: '',
    degreeLength: '',
    boardCost: '',
    inStateTuition: '',
    outStateTuition: '',
    // states
    stateCode: '',
    stateCrimeRate: '',


  });


  
  // effect for the counter that persists in browser. 
  useEffect(() => {
    if (count > 0) {
      // Update the count in localStorage
      localStorage.setItem('count', count.toString());
      // console.log(localStorage.getItem('count'));

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

  const fetchLowCrimeSchools = () => {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/low-crime`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
        setLoadingSchools(false);
      })
      .catch((error) => {
        console.error('Error fetching low crime schools data:', error);
        setLoadingSchools(false);
      });
  };


  const fetchHighRateMyProf = () => {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/high-ratemyprof`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
        setLoadingSchools(false);
      })
      .catch((error) => {
        console.error('Error fetching low crime schools data:', error);
        setLoadingSchools(false);
      });
  };

  const fetchLowCrimeHighProf = () => {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schools/lowCrimeHighProf`)
      .then((response) => response.json())
      .then((data) => {
        setSchools(data);
        setLoadingSchools(false);
      })
      .catch((error) => {
        console.error('Error fetching low crime schools data:', error);
        setLoadingSchools(false);
      });
  };

  const fetchAllStates = () => {
    setLoadingSchools(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/states`)
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
    console.log(event.target.value);
    setInputValues({
      ...inputValues,
      [field]: event.target.value,
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleOperationSubmit();
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
          StateSalaryRank: parseInt(inputValues.stateSalaryRank),
          EarlyCareerPay: parseFloat(inputValues.earlyCareerPay),
          MidCareerPay: parseFloat(inputValues.midCareerPay),
          STEMPercent: parseInt(inputValues.stemPercent),
          Type: inputValues.type,
          DegreeLength: inputValues.degreeLength,
          BoardCost: parseFloat(inputValues.boardCost),
          InStateTuition: parseFloat(inputValues.inStateTuition),
          OutStateTuition: parseFloat(inputValues.outStateTuition),
      
        }),
      })
        .then((response) => response.json())
        .then(() => {
          fetchSchools();
          setInputValues({
            name: '',
            state: '',
            enrollment: '',
            stateSalaryRank: '',
            earlyCareerPay: '',
            midCareerPay: '',
            stemPercent: '',
            type: '',
            degreeLength: '',
            boardCost: '',
            inStateTuition: '',
            outStateTuition: '',
            stateCode: '',
            stateCrimeRate: '',
          });
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
          StateSalaryRank: parseInt(inputValues.stateSalaryRank),
          EarlyCareerPay: parseFloat(inputValues.earlyCareerPay),
          MidCareerPay: parseFloat(inputValues.midCareerPay),
          STEMPercent: parseInt(inputValues.stemPercent),
          Type: inputValues.type,
          DegreeLength: inputValues.degreeLength,
          BoardCost: parseFloat(inputValues.boardCost),
          InStateTuition: parseFloat(inputValues.inStateTuition),
          OutStateTuition: parseFloat(inputValues.outStateTuition),
        }),
      })
      .then((response) => response.json())
      .then(() => {
        fetchSchools();
        setInputValues({
          name: '',
          state: '',
          enrollment: '',
          stateSalaryRank: '',
          earlyCareerPay: '',
          midCareerPay: '',
          stemPercent: '',
          type: '',
          degreeLength: '',
          boardCost: '',
          inStateTuition: '',
          outStateTuition: '',
          stateCode: '',
          stateCrimeRate: '',
        });
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
  } else if (operation === 'lowCrime') {
    fetchLowCrimeSchools();
  } else if (operation === 'highRateMyProf') {
    fetchHighRateMyProf();
  } else if (operation === 'lowCrimeHighProf') {
    fetchLowCrimeHighProf();
  } else if (operation === 'getAllStates') {
    fetchAllStates();
  } else if (operation === 'updateState') {

    console.log('update state called');
    console.log('inputValues.stateCode:', inputValues.stateCode, ";");
    console.log('inputValues.stateCrimeRate:', inputValues.stateCrimeRate, ";");

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/states/${inputValues.stateCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // StateName: inputValues.stateCode,
        CrimeRate: parseFloat(inputValues.stateCrimeRate),
      }),
    })
    .then(
      (response) => response.json())
    .then(() => {

      setInputValues({
        name: '',
        state: '',
        enrollment: '',
        stateSalaryRank: '',
        earlyCareerPay: '',
        midCareerPay: '',
        stemPercent: '',
        type: '',
        degreeLength: '',
        boardCost: '',
        inStateTuition: '',
        outStateTuition: '',
        stateCode: '',
        stateCrimeRate: '',
      });
    })
    .then(() => fetchAllStates())
    .catch((error) => {
      console.error('Error updating school:', error);
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
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete' || operation === 'lowCrime' || operation == 'highRateMyProf' || operation == 'lowCrimeHighProf') && (
            <TableCell>School Name</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete' || operation === 'lowCrime') && (
            <TableCell align="right">State</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Total Enrollment</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">State Salary Rank</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Early Career Pay</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Mid Career Pay</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">STEM Percent</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Type</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Degree Length</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Board Cost</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">In-State Tuition</TableCell>
          )}
          {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
            <TableCell align="right">Out-State Tuition</TableCell>
          )}
          {(operation === 'lowCrime') && (
            <TableCell align="right">Crime Rate</TableCell>
          )}
          {operation === 'highRateMyProf' && (
            <TableCell align="right">AVG RateMyProf</TableCell>
          )}
          {operation === 'lowCrimeHighProf' && (
            <TableCell align="right">Low Crime, High Prof Score</TableCell>
          )}

          {/* States */}
          {(operation === 'getAllStates' || operation === 'updateState') && (
            <TableCell align="right">State</TableCell>
          )}
          {(operation === 'getAllStates' || operation === 'updateState') && (
            <TableCell align="right">Crime Rate</TableCell>
          )}
          {(operation === 'getAllStates' || operation === 'updateState') && (
            <TableCell align="right">Happiness Score</TableCell>
          )}
     




        </TableRow>
      </TableHead>
      <TableBody>
        {schools.map((school: any, index: number) => (
          <TableRow key={index}>
            {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete' || operation === 'lowCrime' || operation === 'highRateMyProf' || operation === 'lowCrimeHighProf') && (
              <TableCell component="th" scope="row">{school.Name}</TableCell>
            )}
            {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete' || operation === 'lowCrime') && (
              <TableCell align="right">{school.State}</TableCell>
            )}
            {(operation === 'getAll' || operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
              <>
                <TableCell align="right">{school.TotalEnrollment}</TableCell>
                <TableCell align="right">{school.StateSalaryRank}</TableCell>
                <TableCell align="right">{school.EarlyCareerPay}</TableCell>
                <TableCell align="right">{school.MidCareerPay}</TableCell>
                <TableCell align="right">{school.STEMPercent}</TableCell>
                <TableCell align="right">{school.Type}</TableCell>
                <TableCell align="right">{school.DegreeLength}</TableCell>
                <TableCell align="right">{school.BoardCost}</TableCell>
                <TableCell align="right">{school.InStateTuition}</TableCell>
                <TableCell align="right">{school.OutStateTuition}</TableCell>
              </>
            )}
            {(operation === 'lowCrime') && (
              <TableCell align="right">{school.CrimeRate}</TableCell>
            )}
            {operation === 'highRateMyProf' && (
              <TableCell align="right">{school.avg_rating}</TableCell>
            )}
            {operation === 'lowCrimeHighProf' && (
              <TableCell align="right">{school.Score}</TableCell>
            )}

            {/* States */}
            {(operation === 'getAllStates' || operation === 'updateState') && (
              <TableCell align="right">{school.StateName}</TableCell>
            )}
            {(operation === 'getAllStates' || operation === 'updateState') && (
              <TableCell align="right">{school.CrimeRate}</TableCell>
            )}
            {(operation === 'getAllStates' || operation === 'updateState') && (
              <TableCell align="right">{school.HappinessScore}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);



return (
  <div>
    <h1 className={styles.heading}>College Recommendation</h1>
    
    
    <div className={styles.counterContainer}>
        <Button variant="secondary" onClick={() => setCount(count + 1)}>
          count is {count}
        </Button>

        <p className={styles.textButton}>
          <b>Server Message: {serverMessage}</b>
        </p>
    </div>

    <div className={styles.buttonContainer}>
      {/* School Buttons */}
      <Button variant="primary" className={styles.buttonMargin} onClick={() => handleOperationClick('getAll')}>
        Get All Schools
      </Button>
      <Button variant="primary" className={styles.buttonMargin} onClick={() => handleOperationClick('get')}>
        Get School By Name
      </Button>
      <Button variant="primary" className={styles.buttonMargin} onClick={() => handleOperationClick('post')}>
        Create School
      </Button>
      <Button variant="primary" className={styles.buttonMargin} onClick={() => handleOperationClick('put')}>
        Update School
      </Button>
      <Button variant="primary" className={styles.buttonMargin} onClick={() => handleOperationClick('delete')}>
        Delete School
      </Button>
      <Button variant="info" className={styles.buttonMargin} onClick={() => handleOperationClick('lowCrime')}>
        Get Low Crime Schools
      </Button>
      <Button variant="info" className={styles.buttonMargin} onClick={() => handleOperationClick('highRateMyProf')}>
        Get High RateMyProf Schools
      </Button>
      <Button variant="info" className={styles.buttonMargin} onClick={() => handleOperationClick('lowCrimeHighProf')}>
        Get Low Crime and High Prof Rating Schools
      </Button>  
      
      {/* States Buttons */}
      <Button variant="success" className={styles.buttonMargin} onClick={() => handleOperationClick('getAllStates')}>
        Get All States
      </Button>  
      <Button variant="success" className={styles.buttonMargin} onClick={() => handleOperationClick('updateState')}>
        Update State
      </Button>  
    </div>

    {/* //////////////////////////////[ form inputs ]/////////////////////////////// */}
    {operation && (
      <div className="mt-3">
        <form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            {(operation === 'updateState') && (
              <>
                <FormControl
                  placeholder="State Code Name"
                  onChange={(event) => handleInputChange(event, 'stateCode')}
                />
                <FormControl
                  placeholder="State Crime Rate"
                  onChange={(event) => handleInputChange(event, 'stateCrimeRate')}
                />
              </>
              
            )}


            {(operation === 'get' || operation === 'post' || operation === 'put' || operation === 'delete') && (
              <FormControl
                placeholder="School Name"
                onChange={(event) => handleInputChange(event, 'name')}
              />
            )}

            
            {(operation === 'post' || operation === 'put') && (
              <>
                <FormControl
                  placeholder="State"
                  onChange={(event) => handleInputChange(event, 'state')}
                />
                <FormControl
                  placeholder="Total Enrollment"
                  onChange={(event) => handleInputChange(event, 'enrollment')}
                />
                <FormControl
                  placeholder="State Salary Rank"
                  onChange={(event) => handleInputChange(event, 'stateSalaryRank')}
                />
                <FormControl
                  placeholder="Early Career Pay"
                  onChange={(event) => handleInputChange(event, 'earlyCareerPay')}
                />
                <FormControl
                  placeholder="Mid Career Pay"
                  onChange={(event) => handleInputChange(event, 'midCareerPay')}
                />
                <FormControl
                  placeholder="STEM Percent"
                  onChange={(event) => handleInputChange(event, 'stemPercent')}
                />
                <FormControl
                  placeholder="Type"
                  onChange={(event) => handleInputChange(event, 'type')}
                />
                <FormControl
                  placeholder="Degree Length"
                  onChange={(event) => handleInputChange(event, 'degreeLength')}
                />
                <FormControl
                  placeholder="Board Cost"
                  onChange={(event) => handleInputChange(event, 'boardCost')}
                />
                <FormControl
                  placeholder="In-State Tuition"
                  onChange={(event) => handleInputChange(event, 'inStateTuition')}
                />
                <FormControl
                  placeholder="Out-State Tuition"
                  onChange={(event) => handleInputChange(event, 'outStateTuition')}
                />
                
              </>
            )}

            
            
            <Button variant="warning" id="button-addon2" onClick={handleOperationSubmit}>
              Submit
            </Button>
          </InputGroup>
        </form>
      </div>
    )}
    {loadingSchools ? (
      <ul>
        {Array.from({ length: 10 }).map((_, index) => (
          <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
        ))}
      </ul>
    ) : (
      renderTable()
    )}
  </div>
);
}

export default BasicSQL;

