var WebTorrent = require('webtorrent')
var client = new WebTorrent()

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var torrents = [];

app.use(express.static('public'));

//var server = app.listen(80, function () {
//    var port = server.address().port;
//
//    console.log('Server is listening on port: %s', port);
//});


app.get('/watch/:name/:hash', function (req, res) {
    var torrent = {
        name: req.params.name,
        hash: req.params.hash
    };
    var magnetUri = createMagnetUri(torrent.name, torrent.hash);

    var existingTorrent;
    torrents.forEach(function(item){
        if(item.hash === torrent.hash){
            existingTorrent = item;
            return;
        }
    });

    if(existingTorrent !== undefined){
        res.send(existingTorrent.address);
        console.log('Client is streaming: ' + existingTorrent.name);
        return;
    }

    client.add(magnetUri, function (tor) {
        console.log('Client is downloading: ' + torrent.name);
        var server = tor.createServer();
        server.listen();

        torrent.address = ':' + server.address().port + '/0';
        torrents.push(torrent);
        res.send(torrent.address);
    })
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(80, function() {
    console.log('listening on *:80');
});

function createMagnetUri(name, hash) {
    var TRACKER_LIST = '&tr=http%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.org%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337';

    var magnetUri = 'magnet:?xt=urn:btih:' +
        hash + '&dn=' + name +
        TRACKER_LIST;

    return magnetUri;
}

