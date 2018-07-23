/**
 * Created by Administrator on 2018/7/20.
 */
var currency = require('./currency');

console.log('50 Canadian dollars equals this amount of US dollars.');
console.log(currency.canadianToUS(50));

console.log('30 US dollars equals this amount of Canadian dollars');
console.log(currency.USToCanadian(30));

setTimeout(function () {//这里test2中修改了缓存数据后才执行；导致了Log出了修改数据
    console.log('test');
    console.log(currency.test);
},100)
