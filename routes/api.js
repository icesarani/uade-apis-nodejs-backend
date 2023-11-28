/**ROUTE USER APIs. */
const express = require("express");

const router = express.Router();
const users = require("./api/user.route");
const mentors = require("./api/mentor.route");
const service = require("./api/service.route");

router.use("/users", users);
router.use("/mentors", mentors);
router.use("/service", service);

module.exports = router;
