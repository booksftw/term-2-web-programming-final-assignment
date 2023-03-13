const express = require('express');
const mongoose = require('mongoose');
const Sample = require('./models/sample')

const bodyParser = require('body-parser');

const app = express();
// Set up middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://nzachary46:otQaCfVJEQcuiV3h@webdev.plxakzu.mongodb.net/movie-data?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

// Route to render the movies EJS template
app.get('/', (req, res) => {

  res.render('index');
});

app.post('/search', (req, res) => {
  console.log(req.body)

  switch (req.body.filter1) {
    case "title":
      console.log("render title search")
      Sample.find({ title: req.body.query })
        .limit(10)
        .then((movies) => {
          res.render('sample', { movies: movies })
          console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
      break;

    default:
      console.log("Something wrong happened")
      break;
  }
});

// Route to render the movies EJS template
app.get('/sample', (req, res) => {
  // Find movies with a runtime greater than 120 minutes, limit to 10 documents
  Sample.find({ runtime: { $gt: 120 } })
    .limit(10)
    .then((movies) => {
      res.render('sample', { movies: movies });
      console.log(movies)
    })
    .catch((err) => {
      console.log(err);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});