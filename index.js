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

  // Empty search query should return all results
  if (req.body.query === "" && req.body.filter2 === "all_categories") {
    Sample.find({})
      .limit(100)
      .then((movies) => {
        res.render('searchResults', { movies: movies })
        console.log(movies)
      })
      .catch((err) => {
        console.log(err)
      })
    // } else if (req.body.query === "" && req.body.filter2 === "R") {
  }
  // else if (req.body.filter2 !== "all_categories") {
  //   console.log("Else not empty block firing")
  //   Sample.find({ rated: req.body.filter2 })
  //     .limit(10)
  //     .then((movies) => {
  //       res.render('searchResults', { movies: movies })
  //       console.log(movies)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }

  if (req.body.filter2 === "all_categories") {
    switch (req.body.filter1) {
      case "title":
        console.log("render title search")
        // Sample.find({ title: `/(.*)Aileen(.*)/ ` })
        // Sample.find({ title: new RegExp('/(.*)Aileen(.*)/', 'i') })
        Sample.find({ title: new RegExp(req.body.query, 'i') })
          // Sample.find({ title: req.body.query })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
            console.log(movies)
          })
          .catch((err) => {
            console.log(err)
          })
        break;
      case "year":
        console.log("year render")
        Sample.find({ year: req.body.query })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
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
  } else {
    if (req.body.filter1 === "title") {
      console.log("this title block rendered")
      Sample.find({ $and: [{ rated: req.body.filter2 }, { title: new RegExp(req.body.query, 'i') }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // 2 Filters selected
    if (req.body.filter1 === "year")
      console.log("Two Filter selected")
    // Sample.find({ $and: [{ title: req.body.query }, { rated: req.body.filter2 }] })
    Sample.find({ $and: [{ rated: req.body.filter2 }, { year: req.body.query }] })
      .limit(10)
      .then((movies) => {
        res.render('searchResults', { movies: movies })
        console.log(movies)
      })
      .catch((err) => {
        console.log(err)
      })
    // }
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