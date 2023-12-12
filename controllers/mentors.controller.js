var mentorService = require("../services/mentor.service");

// Saving the context of this module inside the _the variable
_this = this;

exports.forgotPassword = async function (req, res, next) {
  try {
    await mentorService.forgotPassword(req.body.mail);
    return res.status(200).json({
      status: 200,
      message: "Mail enviado con exito"
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getMyData = async function (req, res, next) {
  try {
    var mentor = await mentorService.getMentorById(req.params.mentorId);
    if (mentor) {
      return res.status(200).json({
        status: 200,
        message: "Mentor encontrado con exito",
        mentor: mentor
      });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Usuario no encontrado" });
  }
};

// Async Controller function to get the To do List
exports.getMentors = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  try {
    var mentors = await mentorService.getMentors({}, page, limit);
    // Return the mentors list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: mentors,
      message: "Succesfully mentors Recieved"
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.getMentorsByMail = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  let filtro = { email: req.body.email };
  console.log(filtro);
  try {
    var mentors = await mentorService.getMentors(filtro, page, limit);
    // Return the mentors list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: mentors,
      message: "Succesfully mentors Recieved"
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.createMentor = async function (req, res, next) {
  // Req.Body contains the form submit values.
  console.log("llegue al controller", req.body);

  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  let filtro = { email: req.body.email };
  console.log(filtro);

  let mentors;
  try {
    mentors = await mentorService.getMentors(filtro, page, limit);
    // Return the mentors list with the appropriate HTTP password Code and Message.
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }

  if (mentors.total > 0) {
    return res.status(200).json({
      message:
        "El mail ingresado ya existe en nuestra base para otro Mentor, prueba con otro mail o intenta loguearte."
    });
  }

  var mentor = {
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    title: req.body.title,
    workExperience: req.body.workExperience
  };

  console.log(req.file);
  if (req.file) {
    mentor.profilePhoto = req.file.buffer;
    console.log(mentor.profilePhoto);
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var createdmentor = await mentorService.createMentor(mentor);
    return res
      .status(200)
      .json({ createdmentor, message: "Succesfully Created mentor" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "mentor Creation was Unsuccesfull" });
  }
};

exports.updatementor = async function (req, res, next) {
  if (!req.body._id) {
    throw Error("No se puede actualizar si no se tiene el id unico");
  }

  var mentor = {
    name: req.body.name ? req.body.name : null,
    lastName: req.body.lastName ? req.body.lastName : null,
    password: req.body.password ? req.body.password : null
  };

  if (req.file) {
    mentor.profilePhoto = req.file.buffer;
    console.log(mentor.profilePhoto);
  }

  try {
    var updatedmentor = await mentorService.updateMentor(req.body._id, mentor);
    return res.status(200).json({
      status: 200,
      data: updatedmentor,
      message: "Succesfully Updated mentor"
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.removementor = async function (req, res, next) {
  var id = req.body.id;
  try {
    var deleted = await mentorService.deletementor(id);
    res.status(200).send("Succesfully Deleted... ");
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.loginMentor = async function (req, res, next) {
  // Req.Body contains the form submit values.
  console.log("body", req.body);
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Error en la contraseña", status: 400 });
  }

  var mentor = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    // Calling the Service function with the new object from the Request Body
    var loginmentor = await mentorService.loginmentor(mentor);
    console.log(loginmentor);
    if (!loginmentor)
      return res
        .status(400)
        .json({ message: "Error en la contraseña", status: 400 });
    else
      return res
        .status(200)
        .json({ loginmentor, message: "Succesfully login", status: 200 });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res
      .status(400)
      .json({ status: 400, message: "Invalid mentorname or password" });
  }
};
