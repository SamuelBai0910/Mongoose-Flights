// models/flights.js
const mongoose = require('mongoose');
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    enum: ['United','American', 'Southwest'],
    required: true
  },
  airport: {
    type: String,
    enum: ['DEN', 'AUS', 'DFW', 'LAX', 'SAN'],
    default: 'DEN',
    required: true
  },
  flightNo: {
    type: Number,
    required: true,
    min: 10,
    max: 9999
  },
  departs: {
    type: Date,
    required: true
  },
  // destinations:	[destinationSchema]
});

module.exports = mongoose.model(
  'Flight', 
  flightSchema
);
// const destinationSchema = new Schema({
//   airport: {
//     type: String,
//     enum: ['DEN', 'AUS', 'DFW', 'LAX', 'SAN']
//   },
//   arrival: {
//     type: Date
//   }
// })
