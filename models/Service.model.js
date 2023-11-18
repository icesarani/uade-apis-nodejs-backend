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
  nombreProfesor: String,
  mentorId: String,
  comments: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
      },
      name: String,
      comment: String,
      stars: Number
    }
  ],
  hireRequest: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId
      },
      messaje: String,
      name: String,
      phone: String,
      mail: String,
      contactTime: Number,
      status: Number,
      creationDate: Date
    }
  ]
});

ServiceSchema.plugin(mongoosePaginate);
const Service = mongoose.model("services", ServiceSchema);

module.exports = Service;
