const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const workRouter = require("./routes/work");
const privateRouter = require("./routes/wprivate");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");

const app = express();


// express 앱 설정 부분
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

//app.use(logger('dev'));
//app.use(express.json());

app.use(logger('dev'));

//Http 헤더 설정을 자동으로 바꾸어주어 잘 알려진 몇가지 앱의 취약성으로 부터 앱을 보호 할 수 있는 패키지
// 외부 자바스크립트, 이미지 등을 막아서 주석처리함. csp-설정하면 될 듯
// app.use(helmet());
// app.use(
//   csp({
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'"],
//       scriptSrc: ["'self'"],
//     },
//   })
// );
console.log("!:", __dirname);
// 정적 리소스 사용하기
app.use(express.static("public"));

// 미들웨어: 남들이 만들어 놓은거 갖다 씀 / Third-Party: official 하지 않음
// main.js가 실행될 때마다 use안의 코드로 bodyparser 미들웨어가 생성되고 실행됨 -> 사용자가 작성한 post 데이터를 내부적 분석 후 기존의 create_process 시행 후 반환한 것을 request의 body프로퍼티에 들어감

//route의 callback함수의 req.body에 form으로 입력받은 데이터 사용 가능: 웹브라우저 폼에 입력한 데이터가 bodyParser를 통해 req.body로 생성
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // 쿠키사용
app.use(countVisitor()); // 모든 요청 지나감 - 어떤 페이지든 카운트
app.use(compression());

// // DB schema: DB에서 사용할 스키마 설정-정보 어떤식으로 저장할 지 지정 - contact라는 형태의 데이터 저장 시 3개의 항목 지님
// var guestBookSchema = mongoose.Schema({
//   name: { type: String, required: true }, //반드시 입력, Number, Date, Boolean 등 사용 가능
//   pw: { type: String, required: true },
//   content: { type: String, required: true },
// });
// // 스키마의 model을 생성, 1파라미터: mondb에서 사용되는 콜렉션 이름, 2파라미터: 스키마 객체
// //DB에 있는 Contact라는 데이터 콜렉션을 현재 코드의 Contact 변수에 연결
// var GuestBook = mongoose.model("contact", guestBookSchema); // db에 접근하여 data를 변경할 수 있는 함수가짐 https://www.a-mean-blog.com/ko/blog/%ED%86%A0%EB%A7%89%EA%B8%80/_/ORM-Object-relational-mapping-%EA%B3%BC-Model

//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

//app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/work", workRouter);
app.use("/private", privateRouter);


app.use((request, response, next) => {
  response.status(404).send("Cant Find!");
});

// 미들웨어는 순차적 실행: 앞에서 실행되지 못하고 여기까지 오면 실행
// app.use((err, request, response, next) => {
//   console.log(err.stack);
//   response.status(500).send("Something Broke!");
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function countVisitor(req, res, next) {
  if (!req.cookies.count && req.cookies['connect.sid']) {
    // count 쿠키값이 있으면 함수 사용 x, 이 쿠키는 1시간 브라우저 저장(1시간 동안 날짜 검사 x)
    // connext.sid: express session id 저장 쿠키값 -> 여기선 브라우저 쿠키사용 여부 판단 -> 쿠키값 없는 경우 카운팅 시 페이지 열때마다 카운팅
    res.cookie('count', "", { maxArg: 3600000, httpOnly: true });
    let now = new Date();
    let date = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate();
    if (date != req.cookies.countDate) { // count가 없으면 오늘의 날짜를 구하고 countData와 비교
      res.cookie('countDate', date, { maxArg: 86400000, httpOnly: true });
      let Counter = require('./model/counter');
      Counter.findOne({ name: "visitors" }, function (err, counter) {
        if (err) return next();
        if (counter === null) { // visitors 데이터 불러옴 없으면 생성
          Counter.create({ name: "visitors", totalCount: 1, todayCount: 1, date: date });
        } else {
          Counter.totalCount++;
          if (Counter.date == date) {
            Counter.todayCount++;
          } else {
            Counter.todayCount = 1;
            Counter.date = date;
          }
          counter.save();
        }
      });
    }
  }
}

// app.listen(3001, () => console.log("Express app 3001!"));
//module.exports = connection;
module.exports = app;
