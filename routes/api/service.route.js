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
router.get("/getoneservice/:serviceId", ServicesController.getOneService);
router.post("/getmyservices", Authorization, ServicesController.getMyServices);
router.post("/setservice", Authorization, ServicesController.setNewService);
router.post("/addcomment", ServicesController.insertComment);
router.post("/changecommentstatus", ServicesController.changeStatusComment);
router.post("/sethiringrequest", ServicesController.hireService);
router.post("/changehiringstatus", ServicesController.changeHiringStatus);

// Export the Router
module.exports = router;
