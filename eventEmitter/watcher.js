/**
 * Created by Administrator on 2018/8/2.
 */
//该工具可以监视目录（将放在里面的文件名都改成小写），并将文件复制到一个单独的目录中

var events = require('events'),
    util = require('util');//util 模块主要用于支持 Node.js 内部 API 的需求。 大部分实用工具也可用于应用程序与模块开发者。
    util.inherits(Watcher, events.EventEmitter);
var fs = require('fs'),
    watcherDir = './watch',
    preocessDir = './done';

function Watcher(watcherDir, procssDir) {
    this.watcherDir = watcherDir;
    this.processDir = procssDir;
}
Watcher.prototype.watch = function () {//添加处理文件的方法
    var watcher = this;//保存watcher对象的引用，以便在回调函数readdir中使用
    console.log('watch');
    fs.readdir(this.watcherDir, function (err, files) {
        if(err) throw err;
        for(var index in files){//处理watch目录中所有文件
            watcher.emit('process', files[index]);
        }
    })
}
Watcher.prototype.start = function () {//开始监控方法；
    var watcher = this;
    console.log('start');
    fs.watchFile(watcherDir, function () {
        watcher.watch();
    })
}

var watcher = new Watcher(watcherDir, preocessDir);

watcher.on('process', function process(file) {
    var watchFile = this.watcherDir + '/' + file;
    var processedFile = this.processDir + '/' + file.toLowerCase();
    console.log(watchFile, processedFile);
    fs.rename(watchFile, processedFile, function (err) {
        if(err) throw err;
    })
});

watcher.start();
