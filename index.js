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

app.get('/search', async (req, res) => {
  console.log(req.query, 'req query')

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  let sampleCount = 0;
  await Sample.countDocuments({})
    .then(e => sampleCount = e)
    ;
  console.log("SKIP", skip)

  if (req.query.page > 1) {
    console.log("query page greater than 1")
    const movies = await Sample.find({})
      // .skip(5 * page)
      .skip(skip)
      .limit(pageSize)
      .then((movies) => {
        const totalMovies = sampleCount;
        const hasNextPage = (skip + pageSize) < totalMovies;
        res.render('searchResults', { movies: movies, page: page, hasNextPage: hasNextPage, pageSize: pageSize })
        // console.log(movies)
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    const movies = await Sample.find({})
      .skip(5)
      .limit(20)
      .then((movies) => {
        const totalMovies = movies.length;
        const hasNextPage = skip + pageSize < totalMovies;
        res.render('searchResults', { movies: movies, page: page, hasNextPage: hasNextPage, pageSize: pageSize })
        // console.log(movies)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Empty search query should return all results
  if (req.query.query === "" && req.query.filter2 === "all_categories") {
    console.log("Rendering all category blank search")
    const movies = await Sample.find({})
      .skip(5)
      .limit(20)
      .then((movies) => {
        const totalMovies = movies.length;
        const hasNextPage = skip + pageSize < totalMovies;
        res.render('searchResults', { movies: movies, page: page, hasNextPage: hasNextPage, pageSize: pageSize })
        // console.log(movies)
      })
      .catch((err) => {
        console.log(err)
      })

  }


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
      case "runtime-greater":
        console.log("run time greater")
        Sample.find({ runtime: { $gt: req.body.query } })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
            console.log(movies)
          })
          .catch((err) => {
            console.log(err)
          })
        break
      case "runtime-less":
        console.log("run time less")
        Sample.find({ runtime: { $lt: req.body.query } })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
            console.log(movies)
          })
          .catch((err) => {
            console.log(err)
          })
        break
      default:
        console.log("Something wrong happened")
        break;
    }
  } else {
    // 2 Filters selected
    console.log("Two Filter selected NZ")
    if (req.body.filter1 === "title") {
      console.log("this title block rendered")
      Sample.find({ $and: [{ rated: req.body.filter2 }, { title: new RegExp(req.body.query, 'i') }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          // console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    if (req.body.filter1 === "year") {
      // Sample.find({ $and: [{ title: req.body.query }, { rated: req.body.filter2 }] })
      Sample.find({ $and: [{ rated: req.body.filter2 }, { year: req.body.query }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          // console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
      // }
    }

    if (req.body.filter1 === "runtime-greater") {
      Sample.find({ $and: [{ rated: req.body.filter2 }, { runtime: { $gt: req.body.query } }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          // console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    if (req.body.filter1 === "runtime-less") {
      Sample.find({ $and: [{ rated: req.body.filter2 }, { runtime: { $lt: req.body.query } }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          // console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
});

app.post('/search', async (req, res) => {
  console.log(req.query, 'req query')

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  // Empty search query should return all results
  if (req.body.query === "" && req.body.filter2 === "all_categories") {
    const movies = await Sample.find({})
      .limit(20)
      .then((movies) => {
        const totalMovies = movies.length;
        const hasNextPage = skip + pageSize < totalMovies;
        res.render('searchResults', { movies: movies, page: page, hasNextPage: hasNextPage, pageSize: pageSize })
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
      case "runtime-greater":
        console.log("run time greater")
        Sample.find({ runtime: { $gt: req.body.query } })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
            console.log(movies)
          })
          .catch((err) => {
            console.log(err)
          })
        break
      case "runtime-less":
        console.log("run time less")
        Sample.find({ runtime: { $lt: req.body.query } })
          .limit(10)
          .then((movies) => {
            res.render('searchResults', { movies: movies })
            console.log(movies)
          })
          .catch((err) => {
            console.log(err)
          })
        break
      default:
        console.log("Something wrong happened")
        break;
    }
  } else {
    // 2 Filters selected
    console.log("Two Filter selected")
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
    if (req.body.filter1 === "year") {
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

    if (req.body.filter1 === "runtime-greater") {
      Sample.find({ $and: [{ rated: req.body.filter2 }, { runtime: { $gt: req.body.query } }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    if (req.body.filter1 === "runtime-less") {
      Sample.find({ $and: [{ rated: req.body.filter2 }, { runtime: { $lt: req.body.query } }] })
        .limit(10)
        .then((movies) => {
          res.render('searchResults', { movies: movies })
          console.log(movies)
        })
        .catch((err) => {
          console.log(err)
        })
    }
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