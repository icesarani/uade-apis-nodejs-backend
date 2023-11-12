const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const ServiceSchema = new mongoose.Schema({
  title: String,
  profilePhoto: String,
  summaryDescription: String,
  category: String,
  price: String,
  frequency: String,
  rate: Number,
  classType: String,
  nombreProfesor: String
});

ServiceSchema.plugin(mongoosePaginate);
const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
