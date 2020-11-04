var express = require("express");
var momnet = require("moment");
const app = require("../app.js");
var router = express.Router();
//var template = require("../views/template.js");
const { db } = require("../model/db_conn.js");

//여러개 디비 쿼리 적용, 페이지네이션, 댓글 작성, 댓글 삭제, 게시글 작성, 게시글 삭제
// bn: 어떤 게시판인지

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
router.post("/write/:bn/:id", function (req, res) {
  console.log("댓글 작성 입장");
  const body = req.body; //req name으로 보내짐
  let comment = "comment" + req.params.bn;
  console.log("테이블명: " + comment);
  console.log("------");
  console.log(body.name);
  console.log(body.pw);
  console.log(body.content);
  console.log(req.params.id);
  console.log("------");

  let date = momnet().format("YYYY-MM-DD");
  console.log(date);

  db.query('insert into ' + comment + '(userid, userpw, content, date, boardid) values (?, ?, ?, ?, ?);', [body.name, body.pw, body.content, date, req.params.id], function (err, result) {
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
router.post("/write/:bn", function (req, res) {
  const body = req.body; //req name으로 보내짐
  let board = "board" + req.params.bn;
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


router.use("/board/:bn/:pn", function (req, res, next) {

  console.log("?" + req.originalUrl);
  let boardNum = req.params.bn;
  res.locals.boardNum = boardNum;

  db.query("select * from board" + boardNum + ";", function (err, rows1, fields) {
    if (err) {
      throw err;
    }
    res.locals.rows1 = rows1;
    //console.log(rows1);

    let totalCount = rows1.length
    console.log("길이: " + totalCount);

    let page = req.params.pn;
    console.log("page: " + page);

    let countList = 6; // 한 페이지에 출력될 게시물 수
    let countPage = 5; // 한 화면에 출력될 페이지 수, 하단의 페이지 번호

    let totalPage = parseInt(totalCount / countList); // 총 페이지 수
    console.log("totalPage: " + totalPage);
    console.log(totalCount % countList);
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

//Ajax 게시글 목록
// router.post("/board/:bn/list", function (req, res) {
//   console.log("목록1: " + res.locals.page)
//   let page = req.body.value;
//   console.log("목록2: " + page)

// });

// 특정 게시글 읽기
router.get("/board/:bn/:pn/:id", function (req, res) {

  db.query('select * from board' + req.params.bn + ' where id = ?', [req.params.id], function (err, show, fields) { // 보여줄 게시글
    if (err) {
      throw err;
    }
    console.log("현재 페이지: " + res.locals.page);

    let page = res.locals.page;
    // if (req.body.value != undefined) {
    //   page = req.body.value; // 현재 페이지 번호
    // }
    //console.log(page);
    // console.log(show);
    db.query("select * from comment" + req.params.bn + " where boardid = ?;", [req.params.id], function (err, comment, fields) { // 게시글에 맞는 댓글
      if (err) {
        throw err;
      }

      //console.log(rows);
      res.render("wprivate", {
        list4: "/",
        list5: "/work",
        list6: "#post",
        post: res.locals.rows1, // 해당 게시판 목록 정보
        postshow: show, //해당 게시글 내용
        boardnum: req.params.bn, // 현재 게시판
        currentPage: req.params.pn,
        postnum: req.params.id, //게시글 메뉴 - 현재 페이지
        //postnum: 3, //게시글 메뉴 - 현재 페이지
        comment: comment, // 댓글 리스트 정보

        //pagination
        totalCount: res.locals.totalCount,
        totalPage: res.locals.totalPage,
        countList: res.locals.countList,
        countPage: res.locals.countPage,
        page: page,
        startPage: res.locals.startPage,
        endPage: res.locals.endPage,

      });
    });
  });
});

// 게시판 선택 -> 게시글 목록 갱신 ,첫번째 게시글 출력
router.get("/board/:bn/:pn", function (req, res) {
  console.log("b3");
  console.log("게시판 번호: " + res.locals.boardNum);
  console.log("현재 페이지: 넘겨 받은 값 " + res.locals.page);


  db.query("select * from comment" + req.params.bn + " where boardid = 1;", function (err, comment, fields) {
    if (err) {
      throw err;
    }

    res.render("wprivate", {
      list4: "/",
      list5: "/work",
      list6: "#post",

      post: res.locals.rows1,
      postshow: res.locals.rows1,
      postnum: 1,
      boardnum: req.params.bn,
      currentPage: req.params.pn,
      comment: comment,

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

/* GET work page. */
router.get("/", function (req, res) {
  res.redirect('/private/board/1/1');
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