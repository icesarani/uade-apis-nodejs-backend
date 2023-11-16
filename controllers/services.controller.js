const ServicesService = require("../services/services.service");

// Saving the context of this module inside the _the constiable
_this = this;

exports.getMyServices = async function (req, res, next) {
  const option = {
    page: req.query.page ? req.query.page : 1,
    limit: req.query.limit ? req.query.limit : 10
  };

  const filter = { mentorId: req.mentor._id };

  try {
    const myServices = await ServicesService.getMyServices(filter, option);
    return res
      .status(200)
      .json({
        status: 200,
        message: "Servicios obtenidos con exito",
        services: myServices
      });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: e.message, services: [] });
  }
};

exports.setNewService = async function (req, res, next) {
  const service = req.body.service;

  service.hireRequest = [];
  service.comments = [];
  service.mentorId = req.mentor._id;

  try {
    await ServicesService.setNewService(service);
    return res
      .status(200)
      .json({ status: 200, message: "El servicio se ingreso correctamente." });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.hireService = async function (req, res, next) {
  const filtro = { _id: req.body.service._id };
  try {
    await ServicesService.hireService(filtro, req.body.hireReq);
    return res.status(200).json({
      status: 200,
      message: "Se registro correctamente la peticion del servicio."
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.insertComment = async function (req, res, next) {
  const filtro = { _id: req.body.service._id };
  try {
    await ServicesService.insertComment(filtro, req.body.comment);
    return res
      .status(200)
      .json({ status: 200, messaje: "Comentario plasmado." });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

// Async Controller function to get the services list
exports.getServicesByFilters = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let filtro = {};
  try {
    const Services = await ServicesService.getServicesByFilters(
      filtro,
      page,
      limit
    );
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Services,
      message: "Succesfully Services Recieved"
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
