/**
 * Created by Administrator on 2018/7/13.
 */
var http = require("http");//提供HTTP服务器和客户端功能
var fs = require("fs");//内置path模块提供了与文件系统路径相关功能
var path = require("path");
var mime = require("mime");//根据文件扩展名得出mimel类型
var cache = {};//缓存文件内容的对象
//请求不存在
function send404(response) {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Error 404, resource not fount");
    response.end();
};
//文件数据服务
function sendFile(response, filePath, fileConents) {
    response.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath)),
    })
    response.end(fileConents);
}
//确定文件缓存
function serverStatic(response, cache, absPath) {
    if(cache[absPath]){//检查是否缓存在内存中
        sendFile(response, absPath, cache[absPath]);//从内存中返回文件
    } else {
        fs.exists(absPath, function (extsts) {//检查文件是否存在
            if(extsts){//存在
                fs.readFile(absPath, function (err, data) {//从硬盘中读文件
                    if (err) {
                        send404(response)
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);//从硬盘中读文件并返回
                    }
                })
            } else {
                send404(response)
            }
        })
    }
}

//创建服务器：http服务器逻辑
var server = http.createServer(function (request, response) {
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html'
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serverStatic(response, cache, absPath)
})

//启动服务器
server.listen(3000, function () {
    console.log("Server listening on port 3000.")
})


var chatServer = require('./lib/chat_server');//处理基于socket.io的聊天功能
chatServer.listen(server);//启动Socket.io服务器，并提供一个HTTP服务器，是他们可以共用一个TCP/IP端口


var test1 = require('./currency_app/test-currency');
var test1 = require('./currency_app/test2-currency');
