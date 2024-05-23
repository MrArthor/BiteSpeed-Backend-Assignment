const request = require('supertest');
const app = require('../src/index'); // Ensure this path is correct
const pool = require('../src/db');

beforeAll(async () => {
  await pool.query('DELETE FROM contacts');

  await pool.query(`
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
  `);
});

afterAll(async () => {
  await pool.query('DELETE FROM contacts');
  await pool.end();
});

describe('POST /identify', () => {
  it('should return the consolidated contact for an existing email', async () => {
    const response = await request(app)
      .post('/identify')
      .send({ email: 'mcfly@hillvalley.edu' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      contact: {
        primaryContactId: 1,
        emails: ['lorraine@hillvalley.edu', 'mcfly@hillvalley.edu'],
        phoneNumbers: ['123456'],
        secondaryContactIds: [2]
      }
    });
  });

  it('should return the consolidated contact for an existing phone number', async () => {
    const response = await request(app)
      .post('/identify')
      .send({ phoneNumber: '717171' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      contact: {
        primaryContactId: 3,
        emails: ['george@hillvalley.edu', 'biffsucks@hillvalley.edu'],
        phoneNumbers: ['919191', '717171'],
        secondaryContactIds: [5]
      }
    });
  });

  it('should create a new contact if no matching email or phone number is found', async () => {
    const response = await request(app)
      .post('/identify')
      .send({ email: 'newemail@hillvalley.edu', phoneNumber: '999999' });

    expect(response.status).toBe(200);
    expect(response.body.contact.primaryContactId).toBeGreaterThan(20);
    expect(response.body.contact.emails).toEqual(['newemail@hillvalley.edu']);
    expect(response.body.contact.phoneNumbers).toEqual(['999999']);
    expect(response.body.contact.secondaryContactIds).toEqual([]);
  });

  it('should return an error if no email or phone number is provided', async () => {
    const response = await request(app)
      .post('/identify')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Either email or phoneNumber must be provided.');
  });
});
