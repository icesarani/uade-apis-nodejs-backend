// Getting the Newly created Mongoose Model we just created
const Service = require("../models/Service.model");
const Mentor = require("../models/Mentor.model");
const MentorService = require("../services/mentor.service");
const mailService = require("../shared/mailfunc");

// Saving the context of this module inside the _the variable
_this = this;

exports.getServiceToUpdate = async function (filtro, options) {
  try {
    console.log(filtro);
    const services = await Service.paginate(filtro, options);
    console.log(services);
    return services.docs.length > 0 ? services.docs[0] : {};
  } catch (e) {
    throw Error(e.message);
  }
};

exports.obtenerHiringRequestsPorMentorId = async function (mentorId) {
  try {
    // Encuentra todos los servicios que coincidan con el mentorId proporcionado
    const serviciosConMentorId = await Service.find({ mentorId: mentorId });
    console.log(serviciosConMentorId);

    // Extrae los hiringRequest de los servicios que cumplen con el mentorId
    const hiringRequests = serviciosConMentorId.reduce((result, service) => {
      if (service.hireRequest) {
        console.log(service.hireRequest);
        result.push(service.hireRequest);
      }
      console.log(result);
      return result;
    }, []);

    return hiringRequests;
  } catch (error) {
    throw new Error(`Error al obtener los hiringRequests: ${error}`);
  }
};

exports.getMyServices = async function (filter, options) {
  try {
    console.log("llegue al service");
    filter.active = 1;
    const services = await Service.paginate(filter, options);
    return services.docs;
  } catch (e) {}
};

exports.updateService = async function (service) {
  try {
    let newservice = await Service.findOneAndUpdate(
      {
        _id: service._id
      },
      {
        $set: {
          title: service.title,
          summaryDescription: service.summaryDescription,
          category: service.category,
          frequency: service.frequency,
          classType: service.classType,
          price: service.price
        }
      },
      { new: true }
    );
    return newservice;
  } catch (e) {
    throw Error(e.message);
  }
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
    console.log(filtro);
    console.log(hire);

    const result = await Service.updateOne(
      filtro,
      { $push: { hireRequest: hire } },
      { new: true }
    );

    console.log(result);
    return result; // Puedes retornar el resultado si lo necesitas en otro lugar
  } catch (e) {
    console.error(e);
    throw e; // Asegúrate de manejar el error adecuadamente
  }
};

const rateCalculate = (service) => {
  if (!service || !service.comments || service.comments.length === 0) {
    service.rate = 0;
    return service;
  }
  if (!service.comments.filter((c) => c.status === 1)) {
    service.rate = 0;
    return service;
  }

  let rate = 0;
  let aux = 0;
  console.log("estoy en ratecalculate");
  console.log(service.comments);
  for (const comment of service.comments) {
    if (comment.stars != null && comment.status === 1) {
      rate += comment.stars;
      aux++;
    }
  }

  if (aux === 0) {
    service.rate = 0;
    return service;
  }

  service.rate = rate / aux;
  return service;
};

exports.changeStatusComment = async function (
  filterService,
  filterComment,
  newStatus
) {
  try {
    const serviceResult = await Service.findById(filterService._id);
    console.log("El servicio es:");
    console.log(serviceResult);
    if (!serviceResult) {
      console.log("Servicio no encontrado");
      // Manejo si el servicio no es encontrado
      return;
    }

    const commentToUpdate = serviceResult.comments.find(
      (comment) => comment._id.toString() === filterComment._id
    );
    console.log("el comment es:");
    console.log(commentToUpdate);
    if (!commentToUpdate) {
      console.log("Comentario no encontrado en la lista");
      // Manejo si el comentario no es encontrado
      return;
    }

    commentToUpdate.status = newStatus;

    rateCalculate(serviceResult);
    console.log(serviceResult);
    const updatedService = await serviceResult.save();

    console.log("Servicio actualizado:", updatedService);
    // El comentario dentro del servicio ha sido actualizado con éxito

    return updatedService;
  } catch (error) {
    console.error("Error al actualizar el comentario:", error);
    throw new Error("Error al actualizar el comentario: " + error.message);
  }
};

//exports.changeStatusComment = async function (
//  filterService,
//  filterComment,
//  newStatus
//) {
//  Service.findById(filterService._id, (err, serviceResult) => {
//    if (err) {
//      console.error("Error al encontrar el servicio:", err);
//      // Manejo de error, si es necesario
//    } else {
//      console.log(serviceResult);
//
//      // Encuentra el índice del comentario que deseas actualizar en la lista de comentarios
//      const index = serviceResult.comments.findIndex(
//        (comment) => comment._id.toString() === filterComment._id
//      );
//
//      if (index !== -1) {
//        // Actualiza los campos del comentario dentro de la lista
//        serviceResult.comments[index].status = newStatus;
//
//        rateCalculate(serviceResult);
//
//        // Guarda los cambios en el documento padre (servicio)
//        serviceResult.save((error, updatedService) => {
//          if (error) {
//            console.error("Error al guardar los cambios:", error);
//            // Manejo de error, si es necesario
//          } else {
//            console.log("Servicio actualizado:", updatedService);
//            // El comentario dentro del servicio ha sido actualizado con éxito
//          }
//        });
//      } else {
//        console.log("Comentario no encontrado en la lista");
//        // Manejo si el comentario no es encontrado
//      }
//    }
//  });
//};

exports.insertComment = async function (filtro, comment) {
  try {
    comment.commentDate = new Date();
    console.log(comment);

    const updatedService = await Service.findOneAndUpdate(
      filtro,
      {
        $push: { comments: comment }
      },
      { new: true }
    );

    console.log(updatedService);

    if (updatedService) {
      const mentorAux = await MentorService.getMentors(
        { _id: updatedService.mentorId },
        1,
        10
      );

      if (mentorAux.docs.length !== 0) {
        const mentor = mentorAux.docs[0];
        mailService.sendNewComment(
          mentor.email,
          mentor.name,
          comment.name,
          updatedService.title,
          comment.comment
        );
      }
    }

    return updatedService;
  } catch (e) {
    throw new Error("Error while updating services: " + e.message);
  }
};

exports.desactivateService = async function (serviceId) {
  try {
    let response = await Service.findOneAndUpdate(
      { _id: serviceId },
      { $set: { active: false } },
      { new: true }
    );
    console.log(response);
  } catch (e) {
    throw Error("Error al actualizar el servicio");
  }
};

exports.changeHiringStatus = async function (hiringReqId, newStatus) {
  try {
    const updatedService = await Service.findOneAndUpdate(
      {
        "hireRequest._id": hiringReqId
      },
      {
        $set: { "hireRequest.$.status": newStatus }
      },
      { new: true }
    );

    if (!updatedService) {
      throw new Error(
        "No se encontró el servicio o la solicitud de contratación"
      );
    }

    return updatedService;
  } catch (e) {
    throw new Error("Error al cambiar un estado de petición: " + e.message);
  }
};

exports.getOneSpecificService = async function (filtro) {
  let response;
  let resultado;
  filtro.active = 1;
  try {
    response = await Service.findOne(filtro);
    response.comments = response.comments.filter((f) => f.status === 1);
    if (response) {
      var page = 1;
      var limit = 10;
      var query = { _id: response.mentorId };
      const mentorAux = await MentorService.getMentors(query, page, limit);
      if (mentorAux.docs) {
        resultado = { mentor: mentorAux.docs[0], service: response };
        return resultado;
      } else {
        throw Error("No se encontro le mentor del servicio");
      }
    }
  } catch (e) {
    throw Error("Error al obtener el servicio " + e.message);
  }
};

// Async function to get the Services List
exports.getServicesByFilters = async function (filtro) {
  // Try Catch the awaited promise to handle the error
  filtro.active = true;
  console.log(filtro);
  try {
    let result = await Service.aggregate([
      {
        $match: filtro
      },
      {
        $project: {
          title: 1,
          summaryDescription: 1,
          category: 1,
          price: 1,
          frequency: 1,
          rate: 1,
          classType: 1,
          mentorId: { $toObjectId: "$mentorId" }
        }
      },
      {
        $lookup: {
          from: "mentors",
          localField: "mentorId",
          foreignField: "_id",
          as: "mentorInfo"
        }
      },
      {
        $project: {
          title: 1,
          summaryDescription: 1,
          category: 1,
          price: 1,
          frequency: 1,
          rate: 1,
          classType: 1,
          mentorId: 1,
          mentorInfo: { $arrayElemAt: ["$mentorInfo", 0] }, // Obtiene el primer elemento del array
          mentorName: "$mentorInfo.name",
          mentorProfilePhoto: "$mentorInfo.profilePhoto"
        }
      },
      {
        $project: {
          title: 1,
          summaryDescription: 1,
          category: 1,
          price: 1,
          frequency: 1,
          rate: 1,
          classType: 1,
          mentorId: 1,
          mentorName: { $arrayElemAt: ["$mentorName", 0] },
          mentorProfilePhoto: { $arrayElemAt: ["$mentorProfilePhoto", 0] }
        }
      }
    ]).exec();
    console.log(result);
    return result;
    // Return the Services list that was retured by the mongoose promise
    //return await Service.paginate(query, options);
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Services");
  }
};
