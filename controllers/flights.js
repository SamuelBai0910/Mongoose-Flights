// controllers/flights.js
const Flight = require('../models/flight');

module.exports = {
  new: newFlight,
  create,
  index,
  show
};

function index(req, res) {
  Flight.find()
    .then((flights) => {
      res.render('flights/index', {
        flights: flights // Pass the fetched flights to the view
      });
    })
    .catch((err) => {
      console.error('Error fetching flights:', err);
      res.status(500).send('Error fetching flights');
    });
}

function show(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    res.render('flights/show', { flight });  
  })
}

function newFlight(req, res) {
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const defaultDeparts = oneYearLater.toISOString().split('T')[0]; // Get only the date part
  res.render('flights/new', { errorMsg: '', defaultDate: defaultDeparts });
}

function create(req, res) {
  // Remove any whitespace at start and end of cast
  if (req.body.flightNo) req.body.flightNo = req.body.flightNo.trim();

  // Process the 'departs' date field
  if (req.body.departs) {
    const departDate = new Date(req.body.departs);
    if (isNaN(departDate.getTime())) {
      // Invalid date format
      console.error('Invalid date format for departs');
      res.render('flights/new', { errorMsg: 'Invalid date format for departs' });
      return;
    }
    // Convert to ISO date string format for MongoDB
    req.body.departs = departDate.toISOString();
  }

  // Set default value for flightNo if not provided
  if (!req.body.flightNo) {
    req.body.flightNo = 'n/a';
  }

  // Convert flightNo to a number
  req.body.flightNo = Number(req.body.flightNo);

  Flight.create(req.body)
    .then(() => {
      // Redirect to /flights after successful form submission
      res.redirect('/flights');
    })
    .catch((err) => {
      // Typically some sort of validation error
      console.error(err);
      res.render('flights/new', { errorMsg: err.message }); // Render the new flight form again with the error message
    });
}



