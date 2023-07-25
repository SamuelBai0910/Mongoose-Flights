// controllers/flights.js
const Flight = require('../models/flight');
const Ticket = require('../models/ticket');

module.exports = {
  new: newFlight,
  create,
  index,
  show,
  addDestination,
  addTicketForm,
  createTicket
};

function addDestination(req, res) {
  const { airport, arrival } = req.body;
  Flight.findById(req.params.id)
    .then((flight) => {
      if (!flight) {
        return res.status(404).send('Flight not found');
      }
      flight.destinations.push({ airport, arrival }); 
      return flight.save();
    })
    .then(() => {
      res.redirect(`/flights/${req.params.id}`);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error adding destination');
    });
}

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
      if (!flight) {
        console.error('Error fetching flight: Flight not found');
        return res.status(404).send('Flight not found');
      }

      Ticket.find({ flight: flight._id })
        .then(tickets => {
          res.render('flights/show', {
            flight: flight,
            tickets: tickets
          });
        })
        .catch(err => {
          console.error('Error fetching tickets:', err);
          res.status(500).send('Error fetching tickets');
        });
    })
    .catch(err => {
      console.error('Error fetching flight:', err);
      res.status(500).send('Error fetching flight');
    });
}

function addTicketForm(req, res) {
  const flightId = req.params.id;
  res.render('tickets/new', { flightId }); // Pass flightId to the new ticket view
}

function createTicket(req, res) {
  const flightId = req.params.id;
  const { seat, price } = req.body;

  Flight.findById(flightId)
    .then(flight => {
      if (!flight) {
        console.error('Error fetching flight: Flight not found');
        return res.status(404).send('Flight not found');
      }

      // Create a new ticket and set its flight property to the flight ID
      const newTicket = new Ticket({
        seat: seat,
        price: price,
        flight: flight._id
      });

      // Save the ticket to the database
      return newTicket.save();
    })
    .then(() => {
      res.redirect(`/flights/${flightId}`);
    })
    .catch(err => {
      console.error('Error creating ticket:', err);
      res.status(500).send('Error creating ticket');
    });
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



