// Getting the Newly created Mongoose Model we just created
const Service = require("../models/Service.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getMyServices = async function (filter, options) {
  try {
    console.log("llegue al service");
    const services = await Service.paginate(filter, options);
    console.log(services);
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

const rateCalculate = (service) => {
  if (!service || !service.comments || service.comments.length === 0) {
    service.rate = 1;
    return service;
  }

  let rate = 0;
  let aux = 0;
  for (const comment of service.comments) {
    if (comment.stars != null && comment.status == 1) {
      rate += comment.stars;
      aux++;
    }
  }

  service.rate = rate / aux;
  return service;
};

exports.changeStatusComment = async function (
  filterService,
  filterComment,
  newStatus
) {
  Service.findById(filterService._id, (err, serviceResult) => {
    if (err) {
      console.error("Error al encontrar el servicio:", err);
      // Manejo de error, si es necesario
    } else {
      // Encuentra el documento dentro de la lista que deseas actualizar
      const commentResult = serviceResult.comments.id(filterComment._id);

      if (commentResult) {
        // Actualiza los campos del documento dentro de la lista
        commentResult.status = newStatus;

        rateCalculate(serviceResult);

        // Guarda los cambios en el documento padre
        serviceResult.save((error, serviceResult) => {
          if (error) {
            console.error("Error al guardar los cambios:", error);
            // Manejo de error, si es necesario
          } else {
            console.log("Documento actualizado:", serviceResult);
            // El documento dentro de la lista ha sido actualizado con éxito
          }
        });
      } else {
        console.log("Documento dentro de la lista no encontrado");
        // Manejo si el documento dentro de la lista no es encontrado
      }
    }
  });
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
      "_id profilePhoto title summaryDescription category price secuency rate classType"
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
