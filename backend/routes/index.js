const express = require("express");
const userRouter = require("./userRouter");

const router = express.Router();
router.use("/user" , userRouter);
router.use("/account" , );
module.exports = router;