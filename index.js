const express = require("express");
const mongoose = require("mongoose");
const Sample = require("./models/sample");

const bodyParser = require("body-parser");

const app = express();
// Set up middleware
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://nzachary46:otQaCfVJEQcuiV3h@webdev.plxakzu.mongodb.net/movie-data?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Route to render the movies EJS template
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search", async (req, res) => {
  // * Keep track of the page, pageSize, and skip
  let page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  let sampleCount = 0;
  let hasNextPage = true;

  // * Empty search query should return all results
  if (req.query.query === "" && req.query.filter2 === "all_categories") {
    const movies = await Sample.find({})
      .skip(skip)
      .limit(pageSize)
      .then((movies) => {
        res.render("searchResults", {
          movies: movies,
          page: page,
          hasNextPage: hasNextPage,
          pageSize: pageSize,
          filter2: req.query.filter2,
          filter1: req.query.filter1,
          query: req.query.query,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  if (req.query.filter2 === "all_categories") {
    // * If one filter selected and all categories execute this block
    // * Switch through all filter1 filters and render appropiate page
    switch (req.query.filter1) {
      case "title":
        await Sample.countDocuments({
          title: new RegExp(req.query.query, "i"),
        }).then((e) => {
          sampleCount = e;
          const totalMovies = sampleCount;
          hasNextPage = skip + pageSize < totalMovies;
        })

        const movies = await Sample.find({
          title: new RegExp(req.query.query, "i"),
        })
          .skip(skip)
          .limit(pageSize)
          .then((movies) => {
            res.render("searchResults", {
              movies: movies,
              page: page,
              hasNextPage: hasNextPage,
              pageSize: pageSize,
              filter2: req.query.filter2,
              filter1: req.query.filter1,
              query: req.query.query,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case "year":
        await Sample.countDocuments({ year: req.query.query }).then((e) => {
          sampleCount = e;
          const totalMovies = sampleCount;
          hasNextPage = skip + pageSize < totalMovies;
        });

        Sample.find({ year: req.query.query })
          .skip(skip)
          // .skip(page * 5)
          .limit(pageSize)
          .then((movies) => {
            res.render("searchResults", {
              movies: movies,
              page: page,
              hasNextPage: hasNextPage,
              pageSize: pageSize,
              filter2: req.query.filter2,
              filter1: req.query.filter1,
              query: req.query.query,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case "runtime-greater":
        console.log("run time greater");

        await Sample.countDocuments({ runtime: { $gt: req.query.query } }).then(
          (e) => {
            sampleCount = e;
            const totalMovies = sampleCount;
            hasNextPage = skip + pageSize < totalMovies;
          }
        );

        Sample.find({ runtime: { $gt: req.query.query } })
          .skip(skip)
          // .skip(page * 5)
          .limit(pageSize)
          .then((movies) => {
            res.render("searchResults", {
              movies: movies,
              page: page,
              hasNextPage: hasNextPage,
              pageSize: pageSize,
              filter2: req.query.filter2,
              filter1: req.query.filter1,
              query: req.query.query,
            });
            // console.log(movies)
          });
        break;
      case "runtime-less":
        console.log("run time less");

        await Sample.countDocuments({ runtime: { $lt: req.query.query } }).then(
          (e) => {
            sampleCount = e;
            const totalMovies = sampleCount;
            hasNextPage = skip + pageSize < totalMovies;
          }
        );

        Sample.find({ runtime: { $lt: req.query.query } })
          .skip(skip)
          .limit(pageSize)
          .then((movies) => {
            res.render("searchResults", {
              movies: movies,
              page: page,
              hasNextPage: hasNextPage,
              pageSize: pageSize,
              filter2: req.query.filter2,
              filter1: req.query.filter1,
              query: req.query.query,
            });
          });
        break;
      default:
        console.log("Something wrong happened");
        break;
    }
  } else {
    // * 2 Filters selected
    // * Similar to the last block without the switch statement
    if (req.query.filter1 === "title") {
      Sample.find({
        $and: [
          { rated: req.query.filter2 },
          { title: new RegExp(req.query.query, "i") },
        ],
      })
        .skip(skip)
        .limit(pageSize)
        .then((movies) => {
          res
            .render("searchResults", {
              movies: movies,
              page: page,
              hasNextPage: hasNextPage,
              pageSize: pageSize,
              filter2: req.query.filter2,
              filter1: req.query.filter1,
              query: req.query.query,
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
    if (req.query.filter1 === "year") {
      Sample.find({
        $and: [{ rated: req.query.filter2 }, { year: req.query.query }],
      })
      .skip(skip)
      .limit(pageSize)
      .then((movies) => {
        res.render("searchResults", {
          movies: movies,
          page: page,
          hasNextPage: hasNextPage,
          pageSize: pageSize,
          filter2: req.query.filter2,
          filter1: req.query.filter1,
          query: req.query.query,
        });
      });
    }

    if (req.query.filter1 === "runtime-greater") {
      Sample.find({
        $and: [
          { rated: req.query.filter2 },
          { runtime: { $gt: req.query.query } },
        ],
      })
      .skip(skip)
      .limit(pageSize)
      .then((movies) => {
        res.render("searchResults", {
          movies: movies,
          page: page,
          hasNextPage: hasNextPage,
          pageSize: pageSize,
          filter2: req.query.filter2,
          filter1: req.query.filter1,
          query: req.query.query,
        });
      });
    }

    if (req.query.filter1 === "runtime-less") {
      Sample.find({
        $and: [
          { rated: req.query.filter2 },
          { runtime: { $lt: req.query.query } },
        ],
      })
      .skip(skip)
      .limit(pageSize)
      .then((movies) => {
        res.render("searchResults", {
          movies: movies,
          page: page,
          hasNextPage: hasNextPage,
          pageSize: pageSize,
          filter2: req.query.filter2,
          filter1: req.query.filter1,
          query: req.query.query,
        });
      });
    }
  }
});


// Route to render the movies EJS template
app.get("/sample", (req, res) => {
  // Find movies with a runtime greater than 120 minutes, limit to 10 documents
  Sample.find({ runtime: { $gt: 120 } })
    .limit(10)
    .then((movies) => {
      res.render("sample", { movies: movies });
      console.log(movies);
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
