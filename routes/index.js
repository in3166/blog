var express = require("express");
var router = express.Router();
//var index = require("../views/index.ejs");
const app = require("../app.js");
var covert = require("./converXY");
var wea = require("./weather");
const request = require('request');
const moment = require('moment');
const cheerio = require('cheerio');


router.post("/con", function (req, res) {
  let lon = req.body.lon;
  let lat = req.body.lat;

  wea(lat, lon, function (data) {
    res.json(data)
  });
});

/* GET home page. */
router.get("/index", function (req, res) {
  res.redirect("/");
});

router.get("/", function (req, res, next) {
  console.log("Access to Home");
  res.render("index", {
    title: "Cup of Coding Box",
    list1: "top",
    list2: "introduce",
    list3: "me",
    list4: "#introduce",
    list5: "/work",
    list6: "/private",
  });
});

module.exports = router;
