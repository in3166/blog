//Mongo DB
const mongoose = require("mongoose");
//몽구스 글러벌 셋팅
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//node 기본 제공 process.env는 환경변수 가지는 객체이거 대신 string을 가져와서 해도됨(몽고 사이트에서 얻은)
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

//db연결은 앱 실행시 한번만 일어나는 이벤트
db.once("open", function () {
  console.log("DB connected");
});
//다양한 경우에서 일어날 수 잇음
db.on("error", function (err) {
  console.log("DB ERROR: ", err);
});

// DB schema: DB에서 사용할 스키마 설정-정보 어떤식으로 저장할 지 지정 - contact라는 형태의 데이터 저장 시 3개의 항목 지님
var guestBookSchema = mongoose.Schema({
  name: { type: String, required: true }, //반드시 입력, Number, Date, Boolean 등 사용 가능
  pw: { type: String, required: true },
  content: { type: String, required: true },
});
// 스키마의 model을 생성, 1파라미터: mondb에서 사용되는 콜렉션 이름, 2파라미터: 스키마 객체
//DB에 있는 Contact라는 데이터 콜렉션을 현재 코드의 Contact 변수에 연결
var GuestBook = mongoose.model("contact", guestBookSchema); // db에 접근하여 data를 변경할 수 있는 함수가짐 https://www.a-mean-blog.com/ko/blog/%ED%86%A0%EB%A7%89%EA%B8%80/_/ORM-Object-relational-mapping-%EA%B3%BC-Model
