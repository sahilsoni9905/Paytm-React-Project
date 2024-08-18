const mongoose = require("mongoose");

mongoose.connect("");
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
}
