require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { identifyContact } = require('./identify');
const app = express();
const testConnection = require('./test-db-connection');
testConnection();
app.use(bodyParser.json());

app.post('/identify', identifyContact);

module.exports = app;
