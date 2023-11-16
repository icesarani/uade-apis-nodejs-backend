// Getting the Newly created Mongoose Model we just created
const Service = require("../models/Service.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getMyServices = async function (filter, options) {
  try {
    const services = await Service.paginate(filter, options);
    return services;
  } catch (e) {}
};

exports.setNewService = async function (service) {
  try {
    await Service.create(service, (err, result) => {
      if (err) {
        throw Error("Error al agregar el documento " + service.toString());
      }
    });
  } catch (e) {
    throw Error(e.message);
  }
};

exports.hireService = async function (filtro, hire) {
  try {
    hire.status = 0;
    hire.creationDate = Date.now();

    await Service.updateOne(
      filtro,
      { $push: { hireRequest: hire } },
      (err, result) => {
        if (err) {
          throw Error(err);
        }
      }
    );

    console.log(result);
  } catch (e) {}
};

exports.insertComment = async function (filtro, comment) {
  try {
    const result = await Service.updateOne(
      filtro,
      {
        $push: { comments: comment }
      },
      (err, result) => {
        if (err) {
          throw Error(err);
        }
      }
    );
  } catch (e) {
    throw Error("Error while updating services: " + e.Error);
  }
};

// Async function to get the Services List
exports.getServicesByFilters = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  const options = {
    page,
    limit
  };
  // Try Catch the awaited promise to handle the error
  try {
    // Return the Services list that was retured by the mongoose promise
    return await Service.paginate(query, options);
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Services");
  }
};
