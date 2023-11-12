// Getting the Newly created Mongoose Model we just created
const User = require("../models/Service.model");

// Saving the context of this module inside the _the variable
_this = this;

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
    return await User.paginate(query, options);
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Services");
  }
};
