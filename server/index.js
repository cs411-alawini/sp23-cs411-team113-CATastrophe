const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); /// omg this is the problem

require('dotenv').config();


const cors = require('cors'); // Add this line to import the cors package

const corsOptions = {
  origin: '*', // Allow requests from your frontend origin
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));


///////////[ SQL setup ]///////////
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  host: '34.123.216.199',
  user: 'root',
  password: 'welcome123',
  database: 'colleges',
}); 


// Welcome route
app.route('/')
  .get((req, res) => {
    res.json({ message: `Welcome to the root '/'!` });
  });

// Data route
app.route('/api/data')
  .get((req, res) => {
    const count = req.query.count || 0;
    res.json({ message: `${count}` });
  });

// ChatGPT route
app.route('/api/chat')
  .post(async (req, res) => {
    try {
      const messages = req.body.messages;
      const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
        }),
      });

      const data = await response.json();
      const chatResponse = data.choices && data.choices[0] && data.choices[0].message.content;

      res.json({ response: chatResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching ChatGPT response.' });
    }
  });


app.route('/api/schools/low-crime')
  .get((req, res) => {
    const SQL_query = `
      SELECT sc.Name, sc.State, st.CrimeRate 
      FROM School sc
      JOIN State st ON (sc.State=st.Code) 
      WHERE st.CrimeRate < (
        SELECT AVG(CrimeRate) 
        FROM State
      ) 
      ORDER BY st.CrimeRate, sc.Name ASC
      LIMIT 100;
    `;
    dbConnection.query(SQL_query, (error, results) => {
      // console.log(results);
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else {
        res.json(results);
      }
    });
  });


  app.route('/api/schools/high-ratemyprof')
  .get((req, res) => {
    const SQL_query = `
      SELECT sc.Name, AVG(rp.StarRating) as avg_rating 
      FROM School sc JOIN RateProf rp ON (sc.Name = rp.SchoolName) 
      GROUP BY rp.SchoolName 
      ORDER BY avg_rating DESC, sc.Name ASC
      LIMIT 100;
    `;
    dbConnection.query(SQL_query, (error, results) => {
      // console.log(results);
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else {
        res.json(results);
      }
    });
  });


  ////// Stored Procedure defined below //////
  /* 
  CREATE DEFINER=`root`@`%` PROCEDURE `LowCrimeHighProf`()
  BEGIN
      DECLARE currName VARCHAR(256);
      DECLARE currRank REAL;
      DECLARE SchoolCrimeRate REAL;
      DECLARE ProfRating REAL;
      DECLARE exit_loop BOOLEAN DEFAULT FALSE;
      
      DECLARE c CURSOR FOR (SELECT Name
          FROM School
          WHERE TotalEnrollment > 5000);

      DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;
      
      DROP TABLE IF EXISTS FinalTable;
      CREATE TABLE FinalTable (
          Name VARCHAR(256) Primary Key,
          Score INT
      );

      OPEN c;
      
      cloop: LOOP
          FETCH NEXT FROM c INTO currName;
          
          IF exit_loop THEN
              LEAVE cloop;
          END IF;
          
          SET SchoolCrimeRate = (SELECT st.CrimeRate
          FROM State st JOIN School sc ON (st.Code=sc.State)
                          WHERE sc.Name = currName AND st.CrimeRate < (SELECT AVG(CrimeRate) FROM State)
                          ORDER BY st.CrimeRate);

          SET ProfRating = (SELECT AVG(rp.StarRating) as avg_rating
              FROM School sc JOIN RateProf rp ON (sc.Name = rp.SchoolName)
              WHERE sc.Name=currName
          GROUP BY rp.SchoolName
                          ORDER BY avg_rating DESC);

          SET currRank = SchoolCrimeRate + (5 - ProfRating)*20;
          
          INSERT IGNORE INTO FinalTable VALUES(currName, currRank);
        
      END LOOP cloop;
      
      CLOSE c;
      
      SELECT * FROM FinalTable ORDER BY Score DESC LIMIT 100;
      
  END
  */

  app.route('/api/schools/lowCrimeHighProf')
  .get((req, res) => {
    // Call the stored procedure instead of defining it here
    const SQL_query = 'CALL LowCrimeHighProf()';
    dbConnection.query(SQL_query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else {
        res.json(results[0]);
      }
    });
  });


  // must be different with individual get. 
app.route('/api/schools')
  // Get all schools
  .get((req, res) => {
    const SQL_query = 'SELECT * FROM School LIMIT 30';
    dbConnection.query(SQL_query, (error, results) => {
      // console.log(results);
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else {
        res.json(results);
      }
    });
  })
  // Create a new school
  .post((req, res) => {
    const newSchool = req.body;
    const SQL_query = 'INSERT INTO School SET ?';
    dbConnection.query(SQL_query, newSchool, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating new school.' });
      } else {
        res.json({ message: 'New school created.', id: results.insertId });
      }
    });
  });

  app.route('/api/schools/:name')
  // Get a specific school by Name
  .get((req, res) => {
    const school_name = req.params.name;
    // console.log(school_name);

    if (typeof school_name !== 'string') {
      res.status(400).json({ message: 'Invalid input. Name should be a string.' });
      return;
    }

    const SQL_query = "SELECT * FROM School WHERE Name LIKE CONCAT('%', ?, '%')";
    // console.log(SQL_query);
    dbConnection.query(SQL_query, [school_name], (error, results) => {
      // console.log(results);
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else if (results.length === 0) {
        res.status(404).json({ message: `School with name ${school_name} not found.` });
      } else {
        res.json(results);
      }
    });
  })


  // Update a specific school by name
  .put((req, res) => {
    const school_name = req.params.name;
    const updatedSchool = req.body;
    const SQL_query = 'UPDATE School SET ? WHERE Name = ?';
    dbConnection.query(SQL_query, [updatedSchool, school_name], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating school.' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: `School with name "${school_name}" not found.` });
      } else {
        res.json({ message: `School with name "${school_name}" updated.` });
      }
    });
  })

  // Delete a specific school by name
  .delete((req, res) => {
    const school_name = req.params.name;
    const SQL_query = 'DELETE FROM School WHERE Name = ?';
    dbConnection.query(SQL_query, [school_name], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting school.' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: `School with name ${school_name} not found.` });
      } else {
        res.json({ message: `School with name ${school_name} deleted.` });
      }
    });
  });


    /////// update a state, then get all the updated states. 
    /////// following is the trigger for update state.
    /*
    CREATE TRIGGER happiness BEFORE UPDATE ON State FOR EACH ROW
    BEGIN
        SET @crimeRate = (
            SELECT CrimeRate
            FROM State
            WHERE Code = NEW.Code
        );

        IF NEW.CrimeRate IS NOT NULL AND NEW.CrimeRate < 5 THEN
            SET NEW.HappinessScore = (@crimeRate - NEW.CrimeRate) + (
                SELECT HappinessScore
                FROM State 
                WHERE Code = OLD.Code
            );
        END IF;

        IF NEW.CrimeRate IS NOT NULL AND NEW.CrimeRate >= 5 THEN
            SET NEW.HappinessScore = (@crimeRate - NEW.CrimeRate) * 1.2 + (
                SELECT HappinessScore
                FROM State 
                WHERE Code = OLD.Code
            );
        END IF;

    END;
    */
    
    app.route('/api/states/:code')
    .put((req, res) => {
      console.log('api update state called');
      const stateCode = req.params.code;
      const { CrimeRate } = req.body;
      
      console.log("states code: " + stateCode);
      console.log("CrimeRate: " + CrimeRate);

      const SQL_update_query = `
        UPDATE State SET CrimeRate = ? 
        WHERE StateName = ?;
      `;
  
      dbConnection.query(SQL_update_query, [CrimeRate, stateCode], (error, results) => {
        console.log('Results:', results);

        if (error) {
          console.error(error);
          res.status(500).json({ message: 'Error updating data in the database.' });
        } else {
          if (results.affectedRows === 0) {
            res.status(404).json({ message: `No state found with code ${stateCode}.` });
          } else {
            res.json({ message: `State with code ${stateCode} updated.` });
          }
        }
      });
    });
  



  // get all STATES
  app.route('/api/states')
  .get((req, res) => {
    // Call the stored procedure instead of defining it here
    const SQL_query = 'SELECT * FROM State ORDER BY HappinessScore DESC LIMIT 60' ;
    dbConnection.query(SQL_query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from the database.' });
      } else {
        res.json(results);
      }
    });
  });





// Start the server
app.listen(PORT, () => {
  console.log(`Node.js server is running on port ${PORT}`);
});
