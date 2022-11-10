const express = require("express");
const cors = require("cors");
const multipart = require('connect-multiparty');
const toobusy = require('toobusy-js');

const routes = require('./routes/');

const app = express();

app.use(express.urlencoded({ limit: "1kb", extended: true }));
app.use(express.json({ limit: "1kb" }));
app.use(multipart({ limit:"10mb" }));

app.use(cors());

app.use(function(req, res, next) {
  if (toobusy()) {
      // log if you see necessary
      res.send(503, "Server Too Busy");
  } else {
  next();
  }
});

app.use(routes)

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);