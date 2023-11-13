var mentorService = require("../services/mentor.service");

// Saving the context of this module inside the _the variable
_this = this;

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
    lastName: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    profilePhoto: req.body.profilephoto,
    workExperience: req.body.workexperience
  };
  try {
    // Calling the Service function with the new object from the Request Body
    var createdmentor = await mentorService.createMentor(mentor);
    return res
      .status(201)
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
  // Id is necessary for the update
  if (!req.body.name) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var mentor = {
    name: req.body.name ? req.body.name : null,
    email: req.body.email ? req.body.email : null,
    password: req.body.password ? req.body.password : null
  };

  try {
    var updatedmentor = await mentorService.updatementor(mentor);
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
  var mentor = {
    email: req.body.email,
    password: req.body.password
  };
  try {
    // Calling the Service function with the new object from the Request Body
    var loginmentor = await mentorService.loginmentor(mentor);
    if (loginmentor === 0)
      return res.status(400).json({ message: "Error en la contraseña" });
    else
      return res
        .status(201)
        .json({ loginmentor, message: "Succesfully login" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res
      .status(400)
      .json({ status: 400, message: "Invalid mentorname or password" });
  }
};
