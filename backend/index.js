const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes");



app.use("/api/v1", mainRouter);
app.listen(3000, function () {
    console.log('backend is running ');

});
