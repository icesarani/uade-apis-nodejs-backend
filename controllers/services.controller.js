const ServicesService = require("../services/services.service");

// Saving the context of this module inside the _the constiable
_this = this;

// Async Controller function to get the services list
exports.getServicesByFilters = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10;
  let filtro = {};
  try {
    const Users = await ServicesService.getUsers(filtro, page, limit);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: "Succesfully Services Recieved"
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
