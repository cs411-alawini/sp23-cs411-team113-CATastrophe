const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const bodyParser = require('body-parser');



const cors = require('cors'); // Add this line to import the cors package


app.use(cors()); // Add this line to enable CORS for all routes, mostly for local

app.get('/', (req, res) => {
  res.json({ message: `Welcome to the root '/'!` });
});

app.get('/api/data', (req, res) => {
  const count = req.query.count || 0;
  res.json({ message: `Hello world ${count}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
