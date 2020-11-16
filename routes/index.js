var express = require("express");
var router = express.Router();
//var index = require("../views/index.ejs");
const app = require("../app.js");
var covert = require("./converXY");
var wea = require("./weather");
const request = require('request');
const moment = require('moment');
const cheerio = require('cheerio');

router.post("/weather", function (req, res) {
  let lon = req.body.lon;
  let lat = req.body.lat;
  // await는 async안에서만 사용 가능하므로 then을 사용
  wea(lat, lon).then(function (val) { // val => ... ));
    //console.log(val);
    res.json(val);
  }).catch(function (err) {
    console.log(err);
    res.statusCode(500);
  });

  const data = async () => {
    console.log(await wea(lat, lon))
    return "done"
  }

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