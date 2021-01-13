//DB
var mysql = require("mysql"); // mysql 모듈을 불러옵니다.
var config = require('./db_config').local;

// 커넥션을 정의합니다.
// RDS Console 에서 본인이 설정한 값을 입력해주세요.\
// module.exports = function () {
//     return {
//         init: function () {
//             return mysql.createConnection({
//                 host: config.host,
//                 user: config.user,
//                 password: config.password,
//                 database: config.database,
//                 port: config.port,
//             })
//         }
//     }
// };

const conn = mysql.createConnection({
    multipleStatements: true, // 여러 쿼리 가능 https://stackoverflow.com/questions/52245174/render-multiple-queries-in-node-express
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
});

// RDS에 접속합니다. 에러 잡기 위해서?
//https://github.com/mysqljs/mysql#establishing-connections
conn.connect(function (err) {
    if (err) {
        throw err; // 접속에 실패하면 에러를 throw 합니다.
    } else {
        // 접속시 쿼리를 보냅니다.
        console.log("DB Connected!");
    }
});

module.exports = {
    db: conn,
    //conn: conn,
}