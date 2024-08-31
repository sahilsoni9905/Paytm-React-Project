const express = require("express");
const userRouter = require("./userRouter");
const accoutRouter = require("./accountRouter");

const router = express.Router();
router.use("/user", userRouter);
router.use("/account", accoutRouter);
module.exports = router;