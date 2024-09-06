const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // Specify the origin
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());

const mainRouter = require("./routes");



app.use("/api/v1", mainRouter);
app.listen(3000, function () {
    console.log('backend is running ');

});
