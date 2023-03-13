// Import the Mongoose library
const mongoose = require('mongoose');

// Define a new movie schema
const sampleSchema = new mongoose.Schema({
  // The plot field is a required string
  plot: {
    type: String,
    required: true
  },
  // The genres field is a required array of strings
  genres: [{
    type: String,
    required: true
  }],
  // The runtime field is a required number
  runtime: {
    type: Number,
    required: true
  },
  // The rated field is a required string
  rated: {
    type: String,
    required: true
  },
  // The title field is a required string
  title: {
    type: String,
    required: true
  },
  // The released field is a required date
  released: {
    type: Date,
    required: true
  },
  // The countries field is a required array of strings
  countries: [{
    type: String,
    required: true
  }]
});

// Export a new movie model using the movie schema
const Sample = mongoose.model('Sample', sampleSchema,'movies');

module.exports = Sample