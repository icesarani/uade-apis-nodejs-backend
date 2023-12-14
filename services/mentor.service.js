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
    console.log(mail);
    const mentor = await Mentor.findOne({ email: mail });
    console.log(mentor);
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

    await mailService.sendForgottenPassword(mentor.email, mentor.name, newPass);
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getMentorById = async function (mentorId) {
  try {
    const mentor = await Mentor.findById(mentorId);
    console.log(mentor);
    return mentor;
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
    console.log("entre al if");
    try {
      urlImage = await imgService.uploadImage(
        "profilephoto-" + mentor.email,
        "mentors",
        mentor.profilePhoto
      );
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
    lastName: mentor.lastName,
    creationDate: new Date(),
    password: hashedPassword,
    title: mentor.title,
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
    const response = { mentor: { _id: savedMentor._id }, token: token };
    return response;
  } catch (e) {
    // return a Error message describing the reason
    console.log(e);
    throw Error("Error while Creating Mentor");
  }
};

exports.updateMentor = async function (mentorId, newMentor) {
  var filter = { _id: mentorId };
  console.log(mentorId);
  let oldMentor;
  try {
    //Find the old Mentor Object by the Id
    oldMentor = await Mentor.findOne(filter);
    console.log(oldMentor);
  } catch (e) {
    throw Error("Error occured while Finding the Mentor");
  }
  // If no old Mentor Object exists return false
  if (!oldMentor) {
    throw Error("El mentor ingresado no existe");
  }
  //Edit the Mentor Object
  console.log(newMentor);

  if (newMentor.workExperience && newMentor.workExperience != "") {
    oldMentor.workExperience = newMentor.workExperience;
  }

  if (newMentor.title && newMentor.title != "") {
    oldMentor.title = newMentor.title;
  }

  if (newMentor.password && newMentor?.password != "") {
    if (newMentor.password) {
      oldMentor.password = bcrypt.hashSync(newMentor.password, 8);
    }
  }

  if (newMentor.name && newMentor.name != "") {
    oldMentor.name = newMentor.name;
  }

  if (newMentor.lastName && newMentor.lastName != "") {
    oldMentor.lastName = newMentor.lastName;
  }

  if (newMentor.profilePhoto) {
    if (oldMentor.profilePhoto && oldMentor.profilePhoto != "") {
      try {
        var result = await imgService.deleteImage(
          "profilephoto-" + oldMentor.email
        );
        console.log(result);
      } catch (e) {}
    }
    try {
      var newImageUrl = await imgService.uploadImage(
        `profilephoto-${oldMentor.email}`,
        "mentors",
        newMentor.profilePhoto
      );
      console.log(newImageUrl);
    } catch (e) {
      console.log(e.message);
    }

    oldMentor.profilePhoto = newImageUrl;
  }

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
    console.log("details " + _details);
    var passwordIsValid = await bcrypt.compare(
      mentor.password,
      _details.password
    );
    console.log(passwordIsValid);
    if (passwordIsValid == false) {
      throw Error("Contraseña invalida");
    }

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
