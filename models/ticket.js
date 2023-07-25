// models/ticket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  seat: {
    type: String,
    match: /[A-F][1-9]\d?/,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  flight: {
    type: Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
