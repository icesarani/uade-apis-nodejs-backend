/**ROUTE USER APIs. */
const express = require("express");

const router = express.Router();
const mentors = require("./api/mentor.route");
const service = require("./api/service.route");

router.use("/mentors", mentors);
router.use("/service", service);

module.exports = router;
