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

exports.changeHiringStatus = async function (
  serviceId,
  hiringReqId,
  newStatus
) {
  try {
    Service.findOneAndUpdate(
      {
        _id: serviceId,
        "hireRequest._id": hiringReqId
      },
      {
        $set: { "hiringRequest.$.status": newStatus }
      },
      { new: true }
    );
  } catch (e) {
    throw Error("Error al cambiar un estado de peticion: " + e.message);
  }
};

exports.getOneSpecificService = async function (filtro) {
  try {
    return await Service.findOne(filtro);
  } catch (e) {
    throw Error("Error al obtener el servicio " + e.message);
  }
};

// Async function to get the Services List
exports.getServicesByFilters = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  const options = {
    page,
    limit,
    select:
      "_id profilePhoto title summaryDescription category price secuency rate classType comments"
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
