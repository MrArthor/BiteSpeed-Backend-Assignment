const express = require('express');
const pool = require('./db');
const testConnection = require('./test-db-connection');
const app = express();
app.use(express.json());
testConnection();
app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Either email or phoneNumber must be provided' });
  }

  try {
    const client = await pool.connect();

    let query = 'SELECT * FROM contacts WHERE email = $1 OR phoneNumber = $2';
    let values = [email, phoneNumber];

    if (!email) {
      query = 'SELECT * FROM contacts WHERE phoneNumber = $1';
      values = [phoneNumber];
    } else if (!phoneNumber) {
      query = 'SELECT * FROM contacts WHERE email = $1';
      values = [email];
    }

    const result = await client.query(query, values);
    const existingContacts = result.rows;

    if (existingContacts.length === 0) {
      const newContactQuery = 'INSERT INTO contacts (email, phoneNumber, linkPrecedence) VALUES ($1, $2, $3) RETURNING *';
      const newContactValues = [email, phoneNumber, 'primary'];
      const newContactResult = await client.query(newContactQuery, newContactValues);
      const newContact = newContactResult.rows[0];

      client.release();
      return res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: [],
        },
      });
    }

    let primaryContact = existingContacts.find((c) => c.linkPrecedence === 'primary');
    if (!primaryContact) {
      primaryContact = existingContacts[0];
      const updatePrimaryQuery = 'UPDATE contacts SET linkPrecedence = $1 WHERE id = $2';
      await client.query(updatePrimaryQuery, ['primary', primaryContact.id]);
    }

    const secondaryContacts = existingContacts.filter((c) => c.id !== primaryContact.id);
    for (const contact of secondaryContacts) {
      if (contact.linkPrecedence !== 'secondary') {
        const updateSecondaryQuery = 'UPDATE contacts SET linkedId = $1, linkPrecedence = $2 WHERE id = $3';
        await client.query(updateSecondaryQuery, [primaryContact.id, 'secondary', contact.id]);
      }
    }

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = new Set();

    emails.add(primaryContact.email);
    phoneNumbers.add(primaryContact.phoneNumber);

    for (const contact of existingContacts) {
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
      if (contact.linkPrecedence === 'secondary') secondaryContactIds.add(contact.id);
    }

    client.release();
    return res.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: Array.from(secondaryContactIds),
      },
    });

  } catch (error) {
    console.error('Error during database query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
