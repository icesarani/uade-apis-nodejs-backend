const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const MentorSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  title: String,
  email: String,
  password: String,
  profilePhoto: String,
  workExperience: String,
  creationDate: Date
});

MentorSchema.plugin(mongoosePaginate);
const Mentor = mongoose.model("mentors", MentorSchema);

module.exports = Mentor;
