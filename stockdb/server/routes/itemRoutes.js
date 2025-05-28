// THIS IS A GENERATED TEMPLATE FILE, USE IT AS A STARTING POINT FOR YOUR OWN CODE
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);

module.exports = router;
