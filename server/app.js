const express = require("express");
const app = express();
const route = require('./route/route')

app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://functionupassignment:cHNiEjbQV8oNl9Xm@functionup.nyvlz.mongodb.net/MERN")
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

  app.use("/", route);

app.listen(5000, () => {
    console.log("Server is running at PORT 5000")
})

