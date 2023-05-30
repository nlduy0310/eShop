const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');

router.get('/', controller.loadSidebarData, controller.show);
router.get('/:id', controller.loadSidebarData, controller.showDetails);

module.exports = router;