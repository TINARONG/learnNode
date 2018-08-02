/**
 * Created by Administrator on 2018/7/13.
 */
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nicknames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function (server) {
    io = socketio.listen(server);//启动Socket.IO服务器，允许它搭载在已有的HTTP服务器
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {//定义每个用户的处理逻辑
        guestNumber = assignGuestName(socket, guestNumber, nicknames, namesUsed);
        joinRoom(socket, 'lobby');//在用户连接上来时把他置Lobby聊天室
        handleMessageBroadcasting(socket, nicknames);//处理用户的消息、更名及聊天室的创建和变更
        handleNameChangeAttempts(socket, nicknames, namesUsed);
        handleRoomJoining(socket);
        
        socket.on('rooms' ,function () {//用户发起聊天时，向他提供已被占用的聊天室列表
            socket.emit('rooms', io.sockets.adapter.rooms);
        });
        handleClientDisconnection(socket, nicknames, namesUsed);//定义用户断开连接后的清理逻辑
    })
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {//分配用户昵称
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit("nameResult", {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit("joinResult",{room: room});//通知该用户他进入了房间
    socket.broadcast.to(room).emit('message', {//向房间内其他用户知道有新用户进入了房间
        text: nicknames[socket.id] + ' has joined ' + room + '.'
    });//给除了自己以外的客户端广播消息
    var usersInRoom =  io.sockets.adapter.rooms[room];//获取连接在该room里的所有user的socket
    if(usersInRoom.length > 1 ){
        var userInRoomSummary = 'Users currently in room ' + room + ":";
        for(var index in usersInRoom.sockets){
      
            var userSocketId = index;
            if(userSocketId != socket.id){
                if(index > 0 ){
                    userInRoomSummary += ','
                }
                userInRoomSummary += nicknames[userSocketId];
            }
        }
        userInRoomSummary += '.';
        socket.emit('message',{//将房间内其他用户汇总发给这个用户；
            text: userInRoomSummary
        })
    }
}

//处理昵称变更请求
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on("nameAttempt", function (name) {
        if(name.indexOf("Guest") != -1){
            socket.emit("nameResult", {
                success: false,
                message: 'Names can not begin with "Guest".'
            });
        } else {
            if(namesUsed.indexOf(name) == -1){
                var previousName = nicknames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nicknames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit("nameResult", {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text:  previousName + ' is now known as' + name + '.'
                })
            } else {
                socket.emit("nameResult", {
                    success: false,
                    message: 'That name is already in use.'
                })
            }
        }
    })
}

//发送聊天信息
function  handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message',{
            text: nicknames[socket.id] + ':' + message.text
        });
    });
}

//创建房间
function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);//踢出分组
        joinRoom(socket, room.newRoom);
    });
}

//用户断开连接
function handleClientDisconnection(socket) {
    socket.on('discount', function () {
        var nameIndex = namesUsed.indexOf(nicknames[socket.id]);
        delete namesUsed[nameIndex];
        delete nicknames[socket.id];
    })
}