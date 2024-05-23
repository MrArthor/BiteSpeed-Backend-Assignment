# **Bitespeed Identify API Documentation**

## **Overview**

The `identify` endpoint is designed to identify and consolidate a customer's identity across multiple purchases based on email and phone number. The endpoint processes the provided contact information and returns a consolidated contact object, linking primary and secondary contacts as necessary.

## **Endpoint**

### **POST /identify**

Identify and consolidate customer information based on email and/or phone number.

### **Request**

#### **Headers**

- `Content-Type: application/json`

#### **Body**

The request body should be a JSON object containing either an `email`, a `phoneNumber`, or both.

```json
{
  "email": "string",
  "phoneNumber": "string"
}
```

- `email` (optional): The email address of the customer.
- `phoneNumber` (optional): The phone number of the customer.

At least one of `email` or `phoneNumber` must be provided.

### **Response**

#### **Success Response**

- **Status Code:** 200 OK

Returns a consolidated contact object.

```json
{
  "contact": {
    "primaryContactId": number,
    "emails": ["string", ...],
    "phoneNumbers": ["string", ...],
    "secondaryContactIds": [number, ...]
  }
}
```

- `primaryContactId` (number): The ID of the primary contact.
- `emails` (array of strings): A list of all associated emails, with the primary contact's email first.
- `phoneNumbers` (array of strings): A list of all associated phone numbers, with the primary contact's phone number first.
- `secondaryContactIds` (array of numbers): A list of IDs of all secondary contacts linked to the primary contact.

#### **Error Response**

- **Status Code:** 400 Bad Request

Returns an error message if neither `email` nor `phoneNumber` is provided.

```json
{
  "error": "Either email or phoneNumber must be provided."
}
```

- **Status Code:** 500 Internal Server Error

Returns an error message for server-side issues.

```json
{
  "error": "Internal server error"
}
```

### **Examples**

#### **Request with Existing Email**

**Request:**

```json
{
  "email": "mcfly@hillvalley.edu"
}
```

**Response:**

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

#### **Request with Existing Phone Number**

**Request:**

```json
{
  "phoneNumber": "717171"
}
```

**Response:**

```json
{
  "contact": {
    "primaryContactId": 3,
    "emails": ["george@hillvalley.edu", "biffsucks@hillvalley.edu"],
    "phoneNumbers": ["919191", "717171"],
    "secondaryContactIds": [5]
  }
}
```

#### **Request with New Contact**

**Request:**

```json
{
  "email": "newemail@hillvalley.edu",
  "phoneNumber": "

999999"
}
```

**Response:**

```json
{
  "contact": {
    "primaryContactId": 21,
    "emails": ["newemail@hillvalley.edu"],
    "phoneNumbers": ["999999"],
    "secondaryContactIds": []
  }
}
```

#### **Request with Missing Parameters**

**Request:**

```json
{}
```

**Response:**

```json
{
  "error": "Either email or phoneNumber must be provided."
}
```

## **Environment Variables**

The database configuration is managed through environment variables. Ensure you have a `.env` file in the root directory of your project with the following variables:

```
DB_USER=your_username
DB_HOST=localhost
DB_DATABASE=your_database
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=false
```

These variables are loaded at runtime using the `dotenv` package.

## **Code Overview**

Here's a brief overview of the code structure related to this endpoint:

#### **Express App Setup (`src/index.js`):**

```javascript
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { identifyContact } = require('./identify');

const app = express();

app.use(bodyParser.json());

app.post('/identify', identifyContact);

module.exports = app;
```

#### **Identify Logic (`src/identify.js`):**

```javascript
const pool = require('./db');

const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
  }

  try {
    // Your SQL queries and logic to find/create contacts
    res.status(200).json({
      contact: {
        primaryContactId: 1,
        emails: ['example@example.com'],
        phoneNumbers: ['1234567890'],
        secondaryContactIds: []
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { identifyContact };
```

#### **Database Setup (`src/db.js`):**

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true',
});

module.exports = pool;
```
