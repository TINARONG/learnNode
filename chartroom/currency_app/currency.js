/**
 * Created by Administrator on 2018/7/20.
 */
var canadianDollar = 0.91;
//典型的模块是一个包含exports对象属性定义的文件
function roundTwoDecimals(amount) {
    return Math.round(amount * 100) /100;
}
exports.canadianToUS = function (canadian) {
    return roundTwoDecimals(canadian * canadianDollar);
}

exports.USToCanadian = function (us) {
    return roundTwoDecimals(us/canadianDollar);
}
//node不允许直接修改exports因此不能直接给exports赋值，可以使用module.exports
//如果创建了一个既有exports又有module.exports的模块，则会返回，module.exports，exports将被忽略；


exports.test = 1;