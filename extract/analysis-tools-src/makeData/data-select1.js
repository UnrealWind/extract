var excel = require('node-xlsx'),
    fs = require('fs');

var srcData = excel.parse('./srcData/test.xlsx')[0].data;
var keys = srcData[0];
var destArr = [];
for (var i = 1; i < 30; i++) {
    var obj = {},
        tmp = srcData[i];
    for (var j = 0; j < keys.length; j++) {
        if (isNumber(tmp[j])) {
            tmp[j] = tmp[j].toFixed(2);
        }
        obj[keys[j]] = tmp[j];
    }
    destArr.push(obj);
}
console.log(destArr);
fs.writeFileSync('./data/data-select1.json', JSON.stringify(destArr));
