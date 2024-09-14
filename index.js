const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user.route");
require("dotenv").config();

app.use(express.json());

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
