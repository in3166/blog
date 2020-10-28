var express = require("express");
var momnet = require("moment");
var router = express.Router();
//var template = require("../views/template.js");
const app = require("../app.js");
const { db } = require("../model/db_conn.js");

//여러개 디비 쿼리 적용, 페이지네이션, 댓글 작성, 댓글 삭제, 게시글 작성, 게시글 삭제
/* GET work page. */
router.post("/write/:pn", function (req, res) {
  const body = req.body; //req name으로 보내짐
  let board = "board" + req.params.pn;
  console.log(board);
  console.log("------");
  console.log(body.postPw);
  console.log("------");
  let date = momnet().format("YYYY-MM-DD");
  let serPw = "zhrqkr12";
  if (body.postPw === serPw) {
    db.query('insert into ' + board + '(title, content, date) values (?, ?, ?);', [body.title, body.content, date], function (err, result) {
      if (err) {
        console.log('insert error', err);
        res.send(501);
      } else {
        console.log("?");
        console.log(`insert title, content, date  = %d %d %s`, body.title, body.content, date);
        res.send(200);
      }
    });
  } else {
    console.log(serPw);
    res.send(500);
  }
});


router.get("/read/:pn/:id", function (req, res) {
  console.log("Access to Private read");
  db.query("select * from board" + req.params.pn + ";", function (err, rows1, fields) {
    db.query('select * from board' + req.params.pn + ' where id = ?', [req.params.id], function (err, show, fields) {
      console.log(show);
      db.query("select * from comment" + req.params.pn + " where boardid = ?;", [req.params.id], function (err, rows, fields) {
        //console.log(rows);
        res.render("wprivate", {
          list4: "/",
          list5: "/work",
          list6: "#post",
          post: rows1,
          postshow: show,
          boardnum: req.params.pn,
          comment: rows
        });
      });
    });
  });
});

/* GET work page. */
router.get("/board/:id", function (req, res) {

  console.log("Access to Private board");
  db.query("select * from board" + req.params.id + ";", function (err, rows1, fields) {
    console.log(rows1);
    db.query("select * from comment1;", function (err, rows, fields) {
      console.log(rows);
      res.render("wprivate", {
        list4: "/",
        list5: "/work",
        list6: "#post",
        post: rows1,
        postshow: rows1,
        boardnum: req.params.id,
        comment: rows
      });
    });
  });
});

/* GET work page. */
router.get("/", function (req, res) {
  console.log("Access to Private");
  db.query("select * from board1;", function (err, rows1, fields) {
    console.log(rows1);
    db.query("select * from comment1;", function (err, rows, fields) {
      console.log(rows);
      res.render("wprivate", {
        list4: "/",
        list5: "/work",
        list6: "#post",
        post: rows1,
        postshow: rows1,
        boardnum: 1,
        comment: rows
      });
    });
  });
});

module.exports = router;
