const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); /// omg this is the problem

require('dotenv').config();


const cors = require('cors'); // Add this line to import the cors package

const corsOptions = {
  origin: 'http://localhost:3002', // Allow requests from your frontend origin
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


app.get('/api/schools', (req, res) => {
  var SQL_query = 'SELECT * FROM School s LIMIT 10';
  dbConnection.query(SQL_query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data from the database.' });
    } else {
      res.json(results);
    }
  });
});


///////////[ --------- ]///////////



app.get('/', (req, res) => {
  res.json({ message: `Welcome to the root '/'!` });
});

app.get('/api/data', (req, res) => {
  const count = req.query.count || 0;
  res.json({ message: `Hello world ${count}` });
});

app.listen(PORT, () => {
  console.log(`Node.js server is running on port ${PORT}`);
});




///////////[ chatgpt ]///////////
app.post('/api/chat', async (req, res) => {
  // console.log(req);
  try {
    const userMessage = req.body.message;
    const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
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






