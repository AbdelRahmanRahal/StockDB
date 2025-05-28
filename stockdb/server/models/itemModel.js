// THIS IS A GENERATED TEMPLATE FILE, USE IT AS A STARTING POINT FOR YOUR OWN CODE
const db = require('../config/db');

const getAllItems = async () => {
  const result = await db.query('SELECT * FROM items');
  return result.rows;
};

const addItem = async ({ name, quantity, price }) => {
  const result = await db.query(
    'INSERT INTO items (name, quantity, price) VALUES ($1, $2, $3) RETURNING *',
    [name, quantity, price]
  );
  return result.rows[0];
};

module.exports = { getAllItems, addItem };
