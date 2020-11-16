var covert = require("./converXY");
const request = require('request');
const moment = require('moment');
const cheerio = require('cheerio');

function weather(lat, lon, callback) {

    let location = covert.toXY(lat, lon);
    console.log(location.x, location.y);

    const nx = location.x;
    const ny = location.y;
    const dataType = 'XML';

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    console.log("time " + minutes)

    if (minutes < 30) {
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if (hours < 0) {
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth() + 1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if (hours < 10) {
        hours = '0' + hours
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    if (dd < 10) {
        dd = '0' + dd
    }

    basedate = yyyy + "" + mm + "" + dd;
    console.log("12321:  " + hours)

    switch (hours) {
        case 23:
        case 24:
        case 01:
            hours = 23;
            break;
        case 02:
        case 03:
        case 04:
            hours = '0' + 2;
            break;
        case 05:
        case 06:
        case 07:
            hours = '0' + 5;
            break;
        case 08:
        case 09:
        case 10:
            hours = '0' + 8;
            break;
        case 11:
        case 12:
        case 13:
            hours = 11;
            break;
        case 14:
        case 15:
        case 16:
            hours = 14;
            break;
        case 17:
        case 18:
        case 19:
            hours = 17;
            break;
        case 20:
        case 21:
        case 22:
            hours = 20;
            break;
        default:
            break;
    }

    console.log("123:  " + hours)

    var _nx = nx,
        _ny = ny,
        apikey = "MCY3wIU4Zx8fdOOEsVJdb3iTtG9GeFn1YnYW1I8wmirD%2FEB3nyQZCvcvIeEfLUCIaPJ8pZA0hSfsR8SLUUFVFA%3D%3D",
        today = yyyy + "" + mm + "" + dd,
        basetime = hours + "00",
        fileName = "http://apis.data.go.kr/1360000/VilageFcstInfoService";
    fileName += "?ServiceKey=" + apikey;
    fileName += "&base_date=" + today;
    fileName += "&base_time=" + basetime;
    fileName += "&nx=" + _nx + "&ny=" + _ny;
    fileName += "&pageNo=1&numOfRows=6";
    fileName += "&_type=json";

    console.log(nx, ny)
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=MCY3wIU4Zx8fdOOEsVJdb3iTtG9GeFn1YnYW1I8wmirD%2FEB3nyQZCvcvIeEfLUCIaPJ8pZA0hSfsR8SLUUFVFA%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('14'); /* */
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /* */
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(basedate); /* */
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(hours + '00'); /* */
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(nx); /* */
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(ny); /* */

    var data = [];

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        //  console.log(body);
        callback(body);
    });
}

function weather2(lat, lon, call) {
    weather(lat, lon, function (body) {
        // console.log(body);
        let data = [];
        $ = cheerio.load(body);
        $('item').each(function (idx) {
            const time = $(this).find('fcstDate').text();
            const cate = $(this).find('category').text();
            const wea_val = $(this).find('fcstValue').text();

            data.push({ "time": time, "cate": cate, "val": wea_val });
            // 출력
            // console.log(`시간 : ${time} 날씨 정보 : ${cate} 값 : ${wea_val}`);
        });
        console.log(data);
        call(data);
        return data;
    })
}

module.exports = weather2;