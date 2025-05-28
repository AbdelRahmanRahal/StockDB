// THIS IS A GENERATED TEMPLATE FILE, USE IT AS A STARTING POINT FOR YOUR OWN CODE
const Item = require('../models/itemModel');

const getItems = async (req, res) => {
  const items = await Item.getAllItems();
  res.json(items);
};

const createItem = async (req, res) => {
  const newItem = await Item.addItem(req.body);
  res.status(201).json(newItem);
};

module.exports = { getItems, createItem };
