const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  date: Date
});

UserSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", UserSchema);

module.exports = User;
