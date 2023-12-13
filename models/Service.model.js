const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const CommentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  name: String,
  comment: String,
  stars: Number,
  commentDate: Date,
  status: Number
});

const HireReqSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  comment: String,
  name: String,
  phoneNumber: String,
  email: String,
  contactHours: String,
  status: Number,
  creationDate: Date
});

const ServiceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  title: String,
  summaryDescription: String,
  category: String,
  price: Number,
  frequency: String,
  rate: Number,
  classType: String,
  mentorId: String,
  comments: [CommentSchema],
  hireRequest: [HireReqSchema],
  active: Boolean
});

ServiceSchema.plugin(mongoosePaginate);
const Service = mongoose.model("services", ServiceSchema);

module.exports = Service;
