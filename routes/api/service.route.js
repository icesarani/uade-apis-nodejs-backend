const express = require("express");
const router = express.Router();
const ServicesController = require("../../controllers/services.controller");
const Authorization = require("../../auth/authorization");

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Llegaste a la ruta de api/service");
});

// Devuelve un listado de todos los servicios por filtro
router.get("/getAvailableServices", ServicesController.getServicesByFilters);
router.post("/insertComment", ServicesController.insertComment);
router.post("/getmyservices", Authorization, ServicesController.getMyServices);
router.post("/setservice", Authorization, ServicesController.setNewService);

// Export the Router
module.exports = router;
