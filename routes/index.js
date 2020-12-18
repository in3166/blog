var express = require("express");
var router = express.Router();
//var index = require("../views/index.ejs");
var wea = require("./weather");


router.post("/weather", function (req, res) {
  let lon = req.body.lon;
  let lat = req.body.lat;
  // await는 async안에서만 사용 가능하므로 then을 사용
  wea(lat, lon).then(function (val) { // val => ... ));
    console.log(val);
    res.json(val);
  }).catch(function (err) {
    console.log(err);
    res.statusCode(500);
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