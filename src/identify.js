const pool = require('./db');

const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
  }

  try {
    let query = 'SELECT * FROM contacts WHERE email = $1 OR phoneNumber = $2';
    let params = [email, phoneNumber];

    const { rows } = await pool.query(query, params);

    if (rows.length === 0) {
      // If no matching contact found, create a new primary contact
      query = `
        INSERT INTO contacts (email, phoneNumber, linkPrecedence)
        VALUES ($1, $2, 'primary')
        RETURNING *
      `;

      const newContact = await pool.query(query, params);
      return res.status(200).json({
        contact: {
          primaryContactId: newContact.rows[0].id,
          emails: [newContact.rows[0].email],
          phoneNumbers: [newContact.rows[0].phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    // Consolidate contacts
    const primaryContact = rows.find(contact => contact.linkPrecedence === 'primary');
    const secondaryContacts = rows.filter(contact => contact.linkPrecedence === 'secondary');

    const emails = [primaryContact.email];
    const phoneNumbers = [primaryContact.phoneNumber];
    const secondaryContactIds = secondaryContacts.map(contact => contact.id);

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { identifyContact };
