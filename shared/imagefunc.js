const cloudinary = require("cloudinary").v2;

// Configura tu cuenta de Cloudinary
cloudinary.config({
  cloud_name: "dybrmprcg",
  api_key: "691693944157614",
  api_secret: "aZvMIcHrwoXDxh-CA-jQeDKABDc"
});

// Configura multer para la carga de archivos
const uploadImage = async (imageBuffer) => {
  const uploadResult = new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(error.message);
        }
        resolve(result.secure_url);
      })
      .end(imageBuffer);
  })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });

  return uploadResult;
};

module.exports = {
  uploadImage
};
