const express = require('express');
const cors = require('cors'); // Add this line to import the cors package
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Add this line to enable CORS for all routes

app.get('/api/data', (req, res) => {
  const count = req.query.count || 0;
  res.json({ message: `Hello world ${count}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
