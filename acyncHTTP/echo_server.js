/**
 * Created by Administrator on 2018/7/23.
 */
//用事件发生器实现的简单的发布/预定系统。

var net = require('net');//Net 模块提供了一些用于底层的网络通信的小工具，包含了创建服务器/客户端的方法
var events = require('events');//events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。

var channel = new events.EventEmitter();//自定义时间发射器！
channel.clinet = {};
channel.substriptions = {};

channel.on('join',function (id, client) {//添加join事件的监听器，保存用户的client对象，以便程序可以将数据发给用户。
    this.clients[id] = client;
    this.substriptions[id] = function (senderId, message) {
        if(id != senderId){//忽略发出这一广播数据的用户
            this.clients[id].write(message);
        }
    };
    this.on('broadcast', this.substriptions[id]);//添加专门针对当前用户的broadcast事件监听器。

});

var server = net.createServer(function (client) {
    var id = client.reomteAddress + ':' + client.remotePoet;
    client.on('connect', function () {
        console.log('Welcome!');
        channel.emit('join', id, client);//当一个用户连接到服务器上时。发出一个join事件，指明用户ID和client对象。
    });
    client.on('data', function (data) {
        data = data.toString();
        channel.emit('broatcast', id, data);//当用户发送数据时，发出一个频道broadcast事件。指明用户ID和消息
    })
})

server.listen(8888)