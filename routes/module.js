

// 첫 번째 방법 : exports에 직접 프로퍼티를 설정
exports.add = function (a, b) {
    return a + b;
}

exports.multiply = function (a, b) {
    return a * b;
}

// 두 번째 방법 : 새로운 객체에 프로퍼티를 설정 후 module.export에 할당하기
var calc = {};

calc.add = function (a, b) {
    return a + b;
}

calc.multiply = function (a, b) {
    return a * b;
}

module.exports = calc;

// 그냥 exports에 객체 할당하면 add 메소드를 찾을 수 없음
// exports를 속성으로 인식하여 전역변수가 아닌 다른 변수로 인식
// exports는  module.exports에 의해 무시된다. / 객체 할당 불가
exports = clac;




// 다른 js파일에서 불러오기
// [ 코드 3 ]
// calc.js 파일 불러오기
// require()는 exports 객체를 반환한다.
var calc = require("./calc");

console.log(calc.add(3, 5));