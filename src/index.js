require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { identifyContact } = require('./identify');
const testConnection = require('./test-db-connection');
testConnection();
const app = express();

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});
app.post('/identify', identifyContact);

const PORT = process.env.PORT || 3000; // Default to port 3000 if not specified in .env

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

