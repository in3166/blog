// 사이트 방문자 수 구하기
var mysql = require("mysql");


module.exports = function Counter(sequelize, DataTypes) {
    return sequelize.define('couter', {
        name: { type: DataTypes.STRING(20), allowNull: false, },
        totalCount: { type: 'increments', nullable: false },
        todayCount: { type: 'string', maxlength: 254 },
        date: { type: 'string', maxlength: 354 }
    });
};