var express = require("express");
var momnet = require("moment");
var router = express.Router();
//var template = require("../views/template.js");
const app = require("../app.js");
const { db } = require("../model/db_conn.js");

//여러개 디비 쿼리 적용, 페이지네이션, 댓글 작성, 댓글 삭제, 게시글 작성, 게시글 삭제
// pn: 어떤 게시판인지

// 최우선 할일: 깃으로 푸시 - 댓글 삭제, 
// 할 일: !! 댓글 삭제 기능, 게시판 게시글 마다 맞는 댓글 가져오기 현재 게시판 상관없이 가져오고 있음. 노드 페이지네이션 구현


//댓글 삭제
router.post("/delete/:id", function (req, res) {
  const body = req.body;
  //console.log(body);
  let pw = body.pw;
  console.log(pw);
  db.query('select * from guest where id = ?', [req.params.id], function (err1, result) {
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

// 댓글 쓰기
router.post("/write/:pn/:id", function (req, res) {
  console.log("댓글 작성 입장");
  const body = req.body; //req name으로 보내짐
  let board = "comment" + req.params.pn;
  console.log("테이블명: " + board);
  console.log("------");
  console.log(body.name);
  console.log(body.pw);
  console.log(body.content);
  console.log(req.params.id);
  console.log("------");

  let date = momnet().format("YYYY-MM-DD");
  console.log(date);

  db.query('insert into ' + board + '(userid, userpw, content, date, boardid) values (?, ?, ?, ?, ?);', [body.name, body.pw, body.content, date, req.params.id], function (err, result) {
    if (err) {
      console.log('\ninsert error!\n', err);
      res.send(501);
    } else {
      console.log(`insert '(userid, userpw, content, date, boardid) = %s %s %s %s %d`, body.name, body.pw, body.content, date, req.params.id);
      res.send(200);
    }
  });
});

// 게시판 글쓰기
router.post("/write/:pn", function (req, res) {
  const body = req.body; //req name으로 보내짐
  let board = "board" + req.params.pn;
  console.log(board);
  console.log("------");
  console.log(body.pw);
  console.log(body.title);
  console.log(body.content);
  console.log("------");
  let date = momnet().format("YYYY-MM-DD");
  console.log(date);
  let serPw = "zhrqkr12";
  if (body.title === "") {
    body.title = "<제목 없음>";
  }
  if (body.pw === serPw) {
    db.query('insert into ' + board + '(title, content, date) values (?, ?, ?);', [body.title, body.content, date], function (err, result) {
      if (err) {
        console.log('insert error', err);
        res.send(503);
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

router.use("/board/:pn", function (req, res, next) {
  let boardNum = req.params.pn;
  res.locals.boardNum = boardNum;
  db.query("select * from board" + req.params.pn + ";", function (err, rows1, fields) {
    console.log("전체 게시글 개수: ");
    res.locals.rows1 = rows1;
    res.locals.totalcount = rows1.length - 1;
    console.log(rows1.length - 1);
    res.locals.countlist = 5;
  });
  next();
});

// 게시글 읽기
router.get("/board/:pn/:id", function (req, res) {
  console.log("b2");
  console.log(res.locals.a);

  db.query('select * from board' + req.params.pn + ' where id = ?', [req.params.id], function (err, show, fields) {
    console.log(show);
    db.query("select * from comment" + req.params.pn + " where boardid = ?;", [req.params.id], function (err, rows, fields) {
      //console.log(rows);
      res.render("wprivate", {
        list4: "/",
        list5: "/work",
        list6: "#post",
        post: res.locals.rows1, // 해당 게시판 목록 정보
        postshow: show, //해당 게시글 내용
        boardnum: req.params.pn, // 현재 게시판
        postnum: req.params.id, //게시글 메뉴 - 현재 페이지
        //postnum: 3, //게시글 메뉴 - 현재 페이지
        comment: rows // 댓글 리스트 정보

      });
    });
  });
});

// 게시판 선택 -> 게시글 목록 갱신 ,첫번째 게시글 출력
router.get("/board/:pn", function (req, res) {
  console.log("b3");
  console.log(res.locals.a);

  db.query("select * from comment1;", function (err, rows, fields) {
    console.log(rows);
    res.render("wprivate", {
      list4: "/",
      list5: "/work",
      list6: "#post",
      post: res.locals.rows1,
      postshow: res.locals.rows1,
      postnum: 1,
      boardnum: req.params.pn,
      comment: rows

    });
  });
  console.log("Access to Private board2");

});

/* GET work page. */
router.get("/", function (req, res) {
  res.redirect('/private/board/1');

  // console.log("Access to Private");
  // db.query("select * from board1;", function (err, rows1, fields) {
  //   console.log(rows1);
  //   db.query("select * from comment1;", function (err, rows, fields) {
  //     console.log(rows);
  //     res.render("wprivate", {
  //       list4: "/",
  //       list5: "/work",
  //       list6: "#post",
  //       post: rows1,
  //       postshow: rows1,
  //       postnum: 1,
  //       boardnum: 1,
  //       comment: rows
  //     });
  //   });
  // });
});

module.exports = router;
