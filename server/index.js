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
    res.json({ message: `Hello world ${count}` });
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


// Start the server
app.listen(PORT, () => {
  console.log(`Node.js server is running on port ${PORT}`);
});
