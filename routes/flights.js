// routes/flights.js
var express = require('express');
var router = express.Router();

var flightsController = require('../controllers/flights');


/* GET routers for flights new */
router.get('/new', flightsController.new);

// Post route for flights
router.post('/', flightsController.create);

// Get route for /flights INDEX
router.get('/', flightsController.index);

/* GET routers for flights show */
router.get('/:id', flightsController.show);

module.exports = router;
