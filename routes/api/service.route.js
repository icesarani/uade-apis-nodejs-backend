const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/services.controller");
const Authorization = require("../../auth/authorization");

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Llegaste a la ruta de  api/service.routes");
});

// Devuelve un listado de todos los servicios por filtro
router.get("/getAvailableServices", ServicesController.getServicesByFilters);

router.post("/login/", UserController.loginUser);


// Export the Router
module.exports = router;
