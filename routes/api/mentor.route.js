const express = require("express");
const router = express.Router();
const MentorController = require("../../controllers/mentors.controller");

// Authorize each API with middleware and map to the Controller Functions
/* GET Mentors listing. */
router.get("/", function (req, res, next) {
  res.send("Llegaste a la ruta de  api/mentors.routes");
});

router.post("/registration", MentorController.createMentor);
router.post("/login", MentorController.loginMentor);
router.post("/forgottenpass", MentorController.forgotPassword);
// Export the Router
module.exports = router;
