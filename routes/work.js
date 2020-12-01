var express = require("express");
var momnet = require("moment");
var router = express.Router();
//var footer1 = require("./footer");
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

router.use("/:pagenum", function (req, res, next) {

  db.query("select * from portpolio;", function (err, rows1, fields) {
    if (err) {
      throw err;
    }
    res.locals.rows1 = rows1;
    console.log("-----------");
    console.log(rows1);
    console.log("-----------");

    let totalCount = rows1.length + 1
    console.log("길이: " + totalCount);

    let page = req.params.pagenum;
    console.log("page: " + page);

    let countList = 6; // 한 페이지에 출력될 게시물 수
    let countPage = 5; // 한 화면에 출력될 페이지 수, 하단의 페이지 번호

    let totalPage = parseInt(totalCount / countList); // 총 페이지 수
    console.log("totalPage: " + totalPage);
    //console.log(totalCount % countList);
    if (totalCount % countList > 0) {
      totalPage++;
    }
    console.log("totalPage: " + totalPage);

    let startPage = parseInt(((page - 1) / countPage)) * countPage + 1;
    let endPage = startPage + countPage - 1;
    console.log("startPage: " + startPage);
    console.log("endPage: " + totalPage);
    //  여기서 마지막 페이지를 보정해줍니다.
    if (endPage > totalPage) {
      endPage = totalPage;
    }
    console.log("endPage: " + totalPage);

    res.locals.totalCount = totalCount;
    res.locals.totalPage = totalPage;
    res.locals.countList = countList;
    res.locals.countPage = countPage;
    res.locals.page = page;
    res.locals.startPage = startPage;
    res.locals.endPage = endPage;
    console.log("__________________________")
    next();
  });
});

/* GET work page. */
router.get("/:pagenum", function (request, res) {
  console.log("Access to Work");
  db.query("SELECT * FROM guest;", function (err, rows, fields) {

    // render 확인, 여기 말고 rows 값만 밖으로 내보낼 수 없는지 확인!
    res.render("work", {
      title: "Work Space",
      list1: "top",
      list2: "portfolio",
      list3: "guest",
      list4: "/",
      list5: "#portfolio",
      list6: "/private",
      guest: rows,
      data: false,
      work: res.locals.rows1,
      //     footer: footer1,

      //pagination
      totalCount: res.locals.totalCount,
      totalPage: res.locals.totalPage,
      countList: res.locals.countList,
      countPage: res.locals.countPage,
      page: res.locals.page,
      startPage: res.locals.startPage,
      endPage: res.locals.endPage,
    });
  });
});

router.get("/", function (request, res) {
  res.redirect('/work/1');
});

module.exports = router;
