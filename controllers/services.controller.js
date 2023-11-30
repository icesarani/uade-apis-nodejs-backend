const ServicesService = require("../services/services.service");

// Saving the context of this module inside the _the constiable
_this = this;

exports.desactivateService = async function (req, res, next) {
  try {
    ServicesService.desactivateService(req.params.serviceId);
    return res.status(200).json({
      status: 200,
      message: "Servicio desactivado con exito"
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: "Servicio desactivado con error"
    });
  }
};

exports.getMyServices = async function (req, res, next) {
  console.log(req);
  console.log(req.body);
  const option = {
    page: req.query.page ? req.query.page : 1,
    limit: req.query.limit ? req.query.limit : 10
  };

  const filter = { mentorId: req.body.mentorId };

  try {
    console.log(filter);
    const myServices = await ServicesService.getMyServices(filter, option);
    return res.status(200).json({
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
  console.log(req.body);

  const service = req.body.service;

  service.hireRequest = [];
  service.comments = [];
  service.rate = 0;
  service.mentorId = req.body.mentorId;
  service.active = 1;

  try {
    await ServicesService.setNewService(service);
    return res
      .status(200)
      .json({ status: 200, message: "El servicio se ingreso correctamente." });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.changeHiringStatus = async function (req, res, next) {
  try {
    await ServicesService.changeHiringStatus(
      req.body.serviceId,
      req.body.hiringReqId,
      req.body.newStatus
    );
    return res.status(200).json({
      status: 200,
      message:
        "Modificado con exito el id " +
        req.body.serviceId +
        " al estado " +
        req.body.newStatus
    });
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

exports.changeStatusComment = async function (req, res, next) {
  const filterService = { _id: req.body.serviceId };
  const filterComment = { _id: req.body.commentId };
  try {
    await ServicesService.changeStatusComment(
      filterService,
      filterComment,
      req.body.commentStatus
    );
    return res
      .status(200)
      .json({ status: 200, message: "Commentario actualizado con exito." });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "No se pudo actualizar el comentario." });
  }
};

exports.insertComment = async function (req, res, next) {
  const filtro = { _id: req.body.service._id };
  const newComment = req.body.comment;
  newComment.status = 0;
  try {
    await ServicesService.insertComment(filtro, newComment);
    return res
      .status(200)
      .json({ status: 200, messaje: "Comentario plasmado." });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getOneService = async function (req, res, next) {
  const filter = { _id: req.params.serviceId };
  try {
    const service = await ServicesService.getOneSpecificService(filter);

    return res.status(200).json({
      status: 200,
      service: service,
      message: "Succesfully Services Recieved"
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

// Async Controller function to get the services list
exports.getServicesByFilters = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let filtro = {};

  if (
    req.body?.filter?.category != undefined &&
    req.body?.filter?.category != ""
  ) {
    filtro.category = req.body?.filter?.category;
  }

  if (
    req.body?.filter?.frequency != undefined &&
    req.body?.filter?.frequency != ""
  ) {
    filtro.frequency = req.body?.filter?.frequency;
  }

  if (
    req.body?.filter?.classType != undefined &&
    req.body?.filter?.classType != ""
  ) {
    filtro.category = req.body?.filter?.category;
  }

  if (
    req.body?.filter?.category != undefined &&
    req.body?.filter?.category != ""
  ) {
    filtro.classType = req.body?.filter?.classType;
  }

  if (req.body?.filter?.rate != undefined && req.body?.filter?.rate != 0) {
    filtro.rate = req.body?.filter?.rate;
  }

  if (
    req.body?.filter?.subject != undefined &&
    req.body?.filter?.subject != 0
  ) {
    filtro.title = req.body?.filter?.subject;
  }

  console.log(req.body);
  console.log(filtro);

  try {
    const services = await ServicesService.getServicesByFilters(filtro);
    // Return the Users list with the appropriate HTTP password Code and Message.

    return res.status(200).json({
      status: 200,
      services: services,
      message: "Succesfully Services Recieved"
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
