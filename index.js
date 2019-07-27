var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var nick;

app.get('/', (req, res) => {
    if (req.query.nick)
        nick = req.query.nick;
    else
        nick = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    res.sendFile(__dirname + '/index.html');
});

let users = [];
let nicks = [];
io.on('connection', (socket) => {
    if (nicks.includes(nick))
        nick = nick + '(' + (Math.floor(Math.random() * 255)).toString() + ')';

    socket['nick'] = nick;
    users.push(socket.id);
    nicks.push(socket.nick);
    console.log(nicks);
    io.emit('baglanti', { chatlog: socket.nick + ' bağlandı', onlines: users.length, nicks: nicks });
    socket.emit('senkimsin', socket.nick);
    socket.on('mesaj', (data) => {
        io.emit('yeni mesaj', { msg: '<b>' + socket.nick + '</b>: ' + data.msg, senderUser: data.senderUser });
    });
    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.id), 1);
        nicks.splice(nicks.indexOf(socket.nick), 1);
        io.emit('baglanti', { chatlog: socket.nick + ' ayrıldı', onlines: users.length, nicks: nicks });
    });


    socket.on('ozelmesaj', (data) => {
        var gk = data.gidenKullanici.split('');
        console.log('gk' + gk);
        gk.splice(0, 1);
        var gk2 = gk.join('');
        console.log('gk2' + gk2);
        var gk3 = users[nicks.indexOf(gk2)];
        console.log('gk3' + gk3);
        io.to(gk3).emit('yeni mesaj', { msg: '<font style="color:red;"><span class="badge badge-secondary">ÖM</span> </font><b>' + socket.nick + '</b>: ' + data.msg, senderUser: data.senderUser });
    });

    socket.on('birileriyaziyor', (data) => {
        if (data == "")
            io.emit('yaziyorlar', ``)
        else
            io.emit('yaziyorlar', `<i style='color:green;opacity:0.6;'>${data} yazıyor...</i>`)
    });


});



http.listen(3000, () => {
    console.log('server.runing.');
});