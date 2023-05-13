
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'links',
  password: '1999',
  port: 5432,
});

const getLinks = (req, res) => {
  pool.query('SELECT * FROM links ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getLinkById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('SELECT * FROM links WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const createLink = (req, res) => {
  const { name, url } = req.body;
  pool.query('INSERT INTO links (name, url) VALUES ($1, $2)', [name, url], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(`Link added with ID: ${results.insertId}`);
  });
};

const updateLink = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, url } = req.body;
  pool.query('UPDATE links SET name = $1, url = $2 WHERE id = $3', [name, url, id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Link modified with ID: ${id}`);
  });
};

const deleteLink = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM links WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Link deleted with ID: ${id}`);
  });
};

module.exports = {
  getLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
};
