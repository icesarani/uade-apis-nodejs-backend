/**ROUTE USER APIs. */
const express = require("express");

const router = express.Router();
const users = require("./api/user.route");
const mentors = require("./api/mentor.route");

router.use("/users", users);
router.use("/mentors", mentors);

module.exports = router;
