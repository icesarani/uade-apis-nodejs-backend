// Getting the Newly created Mongoose Model we just created
var Mentor = require("../models/Mentor.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var mailService = require("../shared/mailfunc");
var imgService = require("../shared/imagefunc");

// Saving the context of this module inside the _the variable
_this = this;

const getRandomPass = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let cadenaAleatoria = "";

  for (let i = 0; i < 10; i++) {
    const caracterAleatorio = caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
    cadenaAleatoria += caracterAleatorio;
  }

  return cadenaAleatoria;
};

exports.forgotPassword = async function (mail) {
  try {
    const mentor = await Mentor.findOne({ email: mail });
    if (!mentor) {
      throw Error("No se encontró ninguna cuenta con el mail ingresado");
    }
    console.log(mentor);
    const newPass = getRandomPass();
    console.log(newPass);
    var hashedPassword = bcrypt.hashSync(newPass, 8);

    await Mentor.findOneAndUpdate(
      {
        _id: mentor._id
      },
      {
        $set: { password: hashedPassword }
      },
      { new: true }
    );

    await mailService.sendForgottenPassword(
      mentor.email,
      mentor.name + " " + mentor.lastName,
      newPass
    );
  } catch (e) {
    throw Error(e.message);
  }
};

// Async function to get the Mentor List
exports.getMentors = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit
  };
  // Try Catch the awaited promise to handle the error
  try {
    var Mentors = await Mentor.paginate(query, options);
    console.log(Mentors.total);
    // Return the Mentord list that was retured by the mongoose promise
    return Mentors;
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Mentors");
  }
};

exports.createMentor = async function (mentor) {
  var urlImage;
  console.log(mentor.profilePhoto);
  if (mentor.profilePhoto) {
    try {
      urlImage = await imgService.uploadImage(mentor.profilePhoto);
    } catch (e) {
      console.error(e);
      throw Error("Error occured while uploading to Cloudinary.");
    }
  }

  // Creating a new Mongoose Object by using the new keyword
  var hashedPassword = bcrypt.hashSync(mentor.password, 8);

  var newMentor = new Mentor({
    name: mentor.name,
    email: mentor.email,
    creationDate: new Date(),
    password: hashedPassword,
    phone: mentor.phone,
    profilePhoto: urlImage,
    workExperience: mentor.workExperience
  });

  try {
    // Saving the Mentor
    const savedMentor = await newMentor.save();
    const token = jwt.sign(
      {
        id: savedMentor._id
      },
      process.env.SECRET,
      {
        expiresIn: 86400 // expires in 24 hours
      }
    );
    return token;
  } catch (e) {
    // return a Error message describing the reason
    console.log(e);
    throw Error("Error while Creating Mentor");
  }
};

exports.updateMentor = async function (Mentor) {
  var id = { name: Mentor.name };
  console.log(id);
  try {
    //Find the old Mentor Object by the Id
    var oldMentor = await Mentor.findOne(id);
    console.log(oldMentor);
  } catch (e) {
    throw Error("Error occured while Finding the Mentor");
  }
  // If no old Mentor Object exists return false
  if (!oldMentor) {
    return false;
  }
  //Edit the Mentor Object
  var hashedPassword = bcrypt.hashSync(Mentor.password, 8);
  oldMentor.name = Mentor.name;
  oldMentor.email = Mentor.email;
  oldMentor.password = hashedPassword;
  try {
    var savedMentor = await oldMentor.save();
    return savedMentor;
  } catch (e) {
    throw Error("And Error occured while updating the Mentor");
  }
};

exports.deleteMentor = async function (id) {
  console.log(id);
  // Delete the Mentor
  try {
    var deleted = await Mentor.remove({
      _id: id
    });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Mentor Could not be deleted");
    }
    return deleted;
  } catch (e) {
    throw Error("Error Occured while Deleting the Mentor");
  }
};

exports.loginmentor = async function (mentor) {
  // Creating a new Mongoose Object by using the new keyword
  try {
    // Find the Mentor
    console.log("login:", mentor);
    var _details = await Mentor.findOne({
      email: mentor.email
    });
    var passwordIsValid = bcrypt.compareSync(
      mentor.password,
      _details.password
    );
    if (!passwordIsValid) return 0;

    var token = jwt.sign(
      {
        id: _details._id
      },
      process.env.SECRET,
      {
        expiresIn: 86400 // expires in 24 hours
      }
    );
    return { token: token, Mentor: _details };
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Login Mentor");
  }
};
