const express = require("express");
const cors = require("cors");
require('dotenv').config({
    path: './.env'
});
const app = express();
const db = require("./db");

const corsOptions = {
    origin: true, // Allow all origins
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());

const mainRouter = require("./routes");



app.use("/api/v1", mainRouter);
app.listen(3000, function () {
    console.log('backend is running ');

});
