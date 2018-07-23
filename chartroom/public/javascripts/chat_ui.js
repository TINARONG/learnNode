/**
 * Created by Administrator on 2018/7/13.
 */
//处理用户输入内容
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

//处理用户原始输入
function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;
    if(message.charAt(0) == '/'){
        systemMessage = chatApp.processCommand(message);
        if(systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#now-room').text(), message);//将非命令输入广播给其他用户
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
};

//客户端程序初始化逻辑
var socket = io.connect();
$(document).ready(function () {
    var chatApp = new Chat(socket);
    
    socket.on('nameResult', function (result) {//现实更名尝试的结果
        var message;
        if(result.success){
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message
        }
        $('#messages').append(divSystemContentElement(message));
    });
    
    socket.on('joinResult',function (result) {//显示房间变更结果
        $('#now-room').text(result.room);
        $('#messages').append(divSystemContentElement('Room changed'));
    });
    
    socket.on('message', function (result) {//现实接收到的消息
        var newElement = $('<div></div>').text(result.text);
        console.log('result', result);
        $('#messages').append(newElement);
    });
    
    socket.on('rooms', function (rooms) {//显示可用房间列表
        $('#room-list').empty();
        console.log('rooms', rooms);
        for (var room in rooms){
            room = room.substring(0 ,room.length);
            if(room != ''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        };
        $('#room-list div').click(function () {//点击房间名切换房间
            chatApp.processCommand('/join' + $(this).text());
            $('#send-message').focus();
        })
    });
    
    setInterval(function () {//定期请求可用房间列表
        socket.emit('rooms', 1000)
    }, 1000);
    
    $('#send-message').focus();
    $('#send-form').submit(function () {//提交表单发送聊天信息
        processUserInput(chatApp, socket);
        return false;
    })
})
