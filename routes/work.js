var express = require("express");
var momnet = require("moment");
var router = express.Router();

var db = require("../model/db_conn").db;
//var conn = require("../model/db_conn").conn; // connect 안해도 사용?

const app = require("../app.js");

router.post("/create", function (req, res) {
  const body = req.body; //req name으로 보내짐
  let date = momnet().format("YYYY-MM-DD");
  db.query('insert into guest(userid, userpw, content, date) values (?, ?, ?, ?);', [body.id, body.pw, body.content, date], function (err, result) {
    //50개 이상의 방명록 삭제
    db.query('DELETE FROM guest WHERE id IN (SELECT id FROM (select @ROWNUM := @ROWNUM + 1 AS ROWNUM, T.* from guest T, (SELECT @ROWNUM := 0) TMP ORDER BY ID DESC) AS A where A.ROWNUM > 50)');
    if (err) {
      console.log('insert error', err);
      res.redirect('/work');
    } else {
      console.log(`insert id, pw, content  = %d %d %s`, body.id, body.pw, body.content);
      res.redirect('/work');
    }
  });
});

router.delete("/delete/:id", function (req, res) {
  const body = req.body;
  //console.log(body);
  let pw = body.pw;
  console.log(pw);
  db.query('select * from guest where id = ?', [req.params.id], function (err1, result) {
    if (err1) {
      throw err1;
    }
    console.log(result[0].userpw);
    if (pw === result[0].userpw) {
      db.query('delete from guest where id = ?', [req.params.id], function (err, result) {
        if (err) {
          console.log('delete error', err);
          //res.redirect('/work');
          res.sned(501);
        } else {
          console.log(`delete id = %d`, req.params.id);
          res.send(200);
        }
      });
    } else {
      // 나중에 alert 나올 수 있게 - ajax - session - send...
      console.log("비밀번호 틀림!");
      res.send(500);
    }
  });
});

router.use("/", function (request, res, next) {
  console.log(0);
  next();
});

/* GET work page. */
router.get("/", function (request, res) {
  console.log("Access to Work");
  db.query("SELECT * FROM guest;", function (err, rows, fields) {

    // render 확인, 여기 말고 rows 값만 밖으로 내보낼 수 없는지 확인!
    res.render("work", {
      list4: "/",
      list5: "#portfolio",
      list6: "/private",
      guest: rows,
      data: false
    });
  });
});

module.exports = router;
