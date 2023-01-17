const express = require("express");

const router = express.Router();

const {authorization} = require("../Controllers/authorization")

const {signUp, getAll, logIn,getOne, logOut} = require("../Controllers/user");

router.route("/user").post(signUp);
router.route("/users").get(getAll);
router.route("/users").post(logIn);
router.route("/users/:id").get(authorization, getOne);
router.route("/logout").post(logOut);



module.exports = router;