/*** Created by Administrator on 2018/7/20.*/
var http = require("http");
var fs = require("fs");

// http.createServer(function (request, response) {//嵌套过多
//     if(request.url == '/'){
//         fs.readFile('./title.json',function (err, data) {
//             if(err) {
//                 console.err(err);
//                 response.end('Server error.')
//             } else {
//                 var titles = JSON.parse(data.toString());
//                 fs.readFile('./templete.html', function (err, data) {
//                     if(err){
//                         console.err(err);
//                         response.end('Servcer error.');
//                     } else {
//                         var temp = JSON.parse(data.toString());
//                         var html = temp.replace('%',titles.join('<li></li>'));
//                         response.writeHead(200, {
//                             'Content-Type': 'text/html'
//                         });
//                         response.end(html);
//                     }
//                 })
//             }
//         })
//     }
// }).listen(8000, "127.0.0.1")



//改版
var server = http.createServer(function (request, response) {
    getTitles(response);
}).listen(8000,'127.0.0.1');

function getTitles(res) {
   fs.readFile('./title.json',function (err, data) {
       if(err){
           hasError(res, err);
       } else{
           getTemplete(JSON.parse(data.toString()), res);
       }
   })
};
function getTemplete(titles, res) {
    
}

function hasError(res, err) {
    console.err(err);
    res.end('Server error.');
}