const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")
//const middleware = require("../middleware/middleware")

router.post("/register", userController.createUser);
router.post("/login", userController.login)

module.exports = router