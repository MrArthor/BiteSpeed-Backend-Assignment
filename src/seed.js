const pool = require('./db');

const seedData = async () => {
  const client = await pool.connect();

  try {
    // Clear the existing data
    await client.query('DELETE FROM contacts');

    // Insert dummy data
    const insertQuery = `
      INSERT INTO contacts (phoneNumber, email, linkedId, linkPrecedence)
      VALUES
        ('123456', 'lorraine@hillvalley.edu', NULL, 'primary'),
        ('123456', 'mcfly@hillvalley.edu', 1, 'secondary'),
        ('919191', 'george@hillvalley.edu', NULL, 'primary'),
        ('717171', 'biffsucks@hillvalley.edu', NULL, 'primary'),
        ('717171', 'george@hillvalley.edu', 3, 'secondary'),
        ('101010', 'doc@hillvalley.edu', NULL, 'primary'),
        ('202020', 'jennifer@hillvalley.edu', NULL, 'primary'),
        ('303030', 'strickland@hillvalley.edu', NULL, 'primary'),
        ('404040', 'goldie@hillvalley.edu', NULL, 'primary'),
        ('505050', 'einstein@hillvalley.edu', NULL, 'primary'),
        ('606060', 'needles@hillvalley.edu', NULL, 'primary'),
        ('707070', 'clara@hillvalley.edu', NULL, 'primary'),
        ('808080', 'biff@hillvalley.edu', NULL, 'primary'),
        ('909090', 'marty@hillvalley.edu', NULL, 'primary'),
        ('111111', 'jules@hillvalley.edu', NULL, 'primary'),
        ('222222', 'verne@hillvalley.edu', NULL, 'primary'),
        ('333333', 'griff@hillvalley.edu', NULL, 'primary'),
        ('444444', 'loraine@hillvalley.edu', NULL, 'primary'),
        ('555555', 'dave@hillvalley.edu', NULL, 'primary'),
        ('666666', 'linda@hillvalley.edu', NULL, 'primary')
    `;

    await client.query(insertQuery);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    client.release();
  }
};

seedData().catch((error) => console.error('Error in seedData:', error));
