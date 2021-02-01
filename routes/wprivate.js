var express = require("express");
var momnet = require("moment");
const app = require("../app.js");
var router = express.Router();
//var template = require("../views/template.js");
const { db } = require("../controller/db_conn.js");


//여러개 디비 쿼리 적용, 페이지네이션, 댓글 삭제, 게시글 삭제
// bn: 어떤 게시판인지

// 최우선 할일: mysql-rownum-페이징, update구현 in work, required구현, 
// 페이징, 페이지네이션 ejs에 id 대신 그냥 i 시퀀셜, 게시물 보여주기에서 rownum으로 select해서 게시물 보여주기 rownum에 맞는 id가 
// get post put delete

// 댓글/게시글 수정
router.put("/:bn/:id", function (req, res) {
  let pw = req.body.pw;
  let content = req.body.content;
  let id = req.body.id;

  console.log("입력한 비밀번호: " + pw);
  console.log("입력한 id: " + id);
  // console.log("입력한 content: " + content);

  db.query('select * from ' + req.params.bn + ' where id = ?', [req.params.id], function (err1, result) {
    //console.log(result[0].userpw);
    if (pw === result[0].userpw || pw === "zhrqkr12") {
      db.query('update ' + req.params.bn + ' set title = \'' + id + '\', content = \'' + content + '\' where id = \'' + req.params.id + '\'', function (err, result) {
        if (err) {
          console.log('delete error', err);
          //res.redirect('/work');
          res.sendStatus(507);
        } else {
          console.log(`delete id = %d`, req.params.id);
          res.sendStatus(200);
        }
      });
    } else {
      // 나중에 alert 나올 수 있게 - ajax - session - send...
      console.log("비밀번호 틀림!");
      res.sendStatus(509);
    }
  });
});

// 댓글/게시글 삭제
router.delete("/:bn/:id", function (req, res) {
  let pw = req.body.pw;
  console.log("입력한 비밀번호: " + pw);
  console.log("아이디: " + req.params.id);
  let url = req.params.bn;
  db.query('select * from ' + req.params.bn + ' where id = ?', [req.params.id], function (err1, result) {
    //console.log(result[0].userpw);
    if (pw === result[0].userpw || pw === "zhrqkr12") {
      if (url.includes('board')) {
        url = url.replace("board", "comment");
        db.query('delete from ' + url + ' where boardid = ?', [req.params.id], function (err, result) {
          if (err) {
            console.log('delete error', err);
            //res.redirect('/work');
            res.sendStatus(501);
          }

        });
      }
      db.query('delete from ' + req.params.bn + ' where id = ?', [req.params.id], function (err, result) {
        if (err) {
          console.log('delete error', err);
          //res.redirect('/work');
          res.send(501);
        } else {
          console.log(`delete id = %d`, req.params.id);
          res.send(200);
        }
      });
    } else {
      // 나중에 alert 나올 수 있게 - ajax - session - send...
      console.log("비밀번호 틀림!");
      res.sendStatus(500);
    }
  });
});

// 댓글 쓰기
router.post("/:bn/:id", function (req, res) {
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

  db.query('insert into ' + comment + '(title, userpw, content, date, boardid) values (?, ?, ?, ?, ?);', [body.name, body.pw, body.content, date, req.params.id], function (err, result) {
    if (err) {
      console.log('\ninsert error!\n', err);
      res.send(501);
    } else {
      db.query('select max(id) AS id from ' + comment, [body.name, body.pw, body.content, date, req.params.id], function (err, id) {
        console.log('현재 댓글 id:');
        console.log(id);
        res.json(
          id
        );
      });
    }
  });
});

// 게시판 글쓰기
router.post("/:bn", function (req, res) {
  const body = req.body; //req name으로 보내짐
  let board = "board" + req.params.bn;
  // console.log(board);
  console.log("-글쓰기-----");
  // console.log(body.pw);
  // console.log(body.title);
  // console.log(body.content);
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


router.use("/board/:bn/:pn", function (req, res, next) {

  console.log("?" + req.originalUrl);
  let boardNum = req.params.bn;
  res.locals.boardNum = boardNum;

  db.query("select * from board" + boardNum + ";", function (err, rows1, fields) {
    if (err) {
      throw err;
    }
    if (typeof rows1 == "undefined" || rows1 == null || rows1.length == null || rows1.length == 0) {
      rows1 = [{ id: '', title: '게시글 없음', content: '', date: '' }]
    }
    res.locals.rows1 = rows1;
    // console.log(rows1);

    let totalCount = rows1.length
    console.log("길이: " + totalCount);

    let page = req.params.pn;
    // console.log("page: " + page);

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

//Ajax 게시글 목록
// router.post("/board/:bn/list", function (req, res) {
//   console.log("목록1: " + res.locals.page)
//   let page = req.body.value;
//   console.log("목록2: " + page)

// });

// 특정 게시글 읽기
router.get("/board/:bn/:pn/:id", function (req, res) {
  // 3번째 게시판 무한 스크롤 구현

  if (res.locals.boardNum == 3) {

    let id = parseInt(req.params.id);
    console.log(id, parseInt(id + 2))
    db.query('select * from (select @ROWNUM := @ROWNUM + 1 AS ROWNUM, T.* from board' + req.params.bn + ' T, (SELECT @ROWNUM := 0) TMP ORDER BY ID asc) A WHERE A.ROWNUM >=? and A.ROWNUM <=?;', [id, id + 2], function (err, post3, fields) { // 보여줄 게시글
      if (err) {
        throw err;
      }
      if (!post3.length) {
        res.sendStatus(404);
      } else {
        // 마지막 페이지의 게시글 댓글 불러오기
        let whereQuery
        if (post3[1] == null) {
          whereQuery = ' where boardid = ' + post3[0].id + ";";
        } else if (post3[2] == null) {
          whereQuery = ' where boardid = ' + post3[0].id + ' or boardid = ' + post3[1].id + ';'
        } else {
          whereQuery = ' where boardid = ' + post3[0].id + ' or boardid = ' + post3[1].id + ' or boardid = ' + post3[2].id + ';';
        }
        db.query("select * from comment" + req.params.bn + whereQuery, function (err, comment, fields) { // 게시글에 맞는 댓글
          if (err) {
            throw err;
          }

          res.json({
            post3: post3,
            comment3: comment,
          });
        });
      }
    });
  } else {
    db.query('select * from board' + req.params.bn + ' where id = ?', [req.params.id], function (err, show, fields) { // 보여줄 게시글
      console.log(req.params.bn, req.params.id)
      if (err) {
        throw err;
      }
      let page = res.locals.page;
      db.query("select * from comment" + req.params.bn + " where boardid = ?;", [req.params.id], function (err, comment, fields) { // 게시글에 맞는 댓글
        if (err) {
          throw err;
        }

        //   console.log(show);
        console.log("??")
        if (show == undefined) {
          show = [{ id: '', title: '게시글 없음', content: '', date: '' }]
        }
        res.render("wprivate", {
          title: "Private Room",
          list1: "top",
          list2: "post",

          list3: "comment",
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
  }
});

// 게시판 선택 -> 게시글 목록 갱신 ,첫번째 게시글 출력
router.get("/board/:bn/:pn", function (req, res) {
  console.log("b3");
  console.log("게시판 번호: " + res.locals.boardNum);
  console.log("현재 페이지: 넘겨 받은 값 " + res.locals.page);

  db.query("select MIN(id) as id from board" + req.params.bn, function (err, postnum, fields) {
    console.log(postnum.id)
    console.log(postnum[0].id)

    db.query("select * from comment" + req.params.bn + " where boardid = " + postnum[0].id + ";", function (err, comment, fields) {
      if (err) {
        throw err;
      }
      res.render("wprivate", {
        title: "Private Room",
        list1: "top",
        list2: "post",
        list3: "comment",
        list4: "/",
        list5: "/work",
        list6: "#post",

        post: res.locals.rows1,
        postshow: res.locals.rows1,
        postnum: postnum[0].id,
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
});

/* GET work page. */
router.get("/", function (req, res) {
  res.redirect('/private/board/1/1');
});

router.get("/board", function (req, res) {
  res.redirect('/private/board/1/1');
});

router.get("/board/1", function (req, res) {
  res.redirect('/private/board/1/1');
});


module.exports = router;