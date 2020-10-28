var express = require("express");
var router = express.Router();
//var index = require("../views/index.ejs");
const app = require("../app.js");

/* GET home page. */
router.get("/index", function (request, res) {
  res.redirect("/");
});
router.get("/", function (request, res, next) {
  console.log("Access to Home");
  res.render("index", {
    list4: "#introduce",
    list5: "/work",
    list6: "/private",
  });
});

module.exports = router;
