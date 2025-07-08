const path = require("path");

const express = require("express");

const authControl = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControl.getLogin);
router.post("/login", authControl.postLogin);
router.post("/log-out", authControl.postLogOut);
router.get("/signup", authControl.getSignup);
router.post("/signup-submit", authControl.postSignup);

module.exports = router;
