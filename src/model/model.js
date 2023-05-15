const { Pool } = require('pg');

const pool = new Pool({
  user: 'johndoe',
  host: 'localhost',
  database: 'user_db',
  password: 'example1234',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM TFG_empresa ORDER BY cif ASC', (error, results) => {
    if (error) {
      response.status(501).json({ status: 'Error 501' });
    }
    response.status(200).json(results.rows);
  });
};

module.exports = getUsers;
