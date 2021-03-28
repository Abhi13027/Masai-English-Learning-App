const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// Importing all the Routes
const userRoutes = require("./routes/userRoutes");

// Importing the Error Middleware
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();

// Connection to Database
connectDB();

// Using the Middlewares
app.use(express.json());
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("The server is up and running");
});
