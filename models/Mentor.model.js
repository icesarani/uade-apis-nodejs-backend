const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const MentorSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  phone: String,
  email: String,
  password: String,
  profilePhoto: String,
  workExperience: [
    {
      title: String,
      desc: String,
      timeMonths: Number
    }
  ]
});

MentorSchema.plugin(mongoosePaginate);
const Mentor = mongoose.model("mentors", MentorSchema);

module.exports = Mentor;
