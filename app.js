/*
 * @file app.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Serveur principal Express avec Socket.IO et configuration des routes
 */

const express = require('express');
const path = require('path');
const itemList = require('./models/itemListSingleton');
const http = require('http');

const app = express();
const port = 3000;
const url = `http://localhost:${port}/`

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const server = http.createServer(app);
const io = require('socket.io')(server);

const indexRouter = require('./routes/index');
indexRouter.setIo(io);

const routes = {
    root : {
        path : '/',
        router : indexRouter
    },
    about : {
        path : '/about',
        router : require('./routes/about')
    },
    contact : { 
        path : '/contact',
        router : require('./routes/contact')
    }
}

for(const key in routes) {
    const obj = routes[key];
    const path = obj.path;
    const route = obj.router;
    app.use(path, route);
}

app.use(function(req, res) {
    res.status(404).render('404');
});

server.listen(port, function() {
    console.log(`Listening on : ${url}`);
});

io.sockets.on('connection', function(socket) {
    socket.emit('initList', itemList.table);
});