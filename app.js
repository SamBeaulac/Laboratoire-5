const express = require('express');
const path = require('path');
var mqtt = require('mqtt');

const app = express();

const port = 3000;
const url = `http://localhost:${port}/`

const routes = {
    root : {
        path : '/',
        router : require('./routes/index')
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

for(const key in routes) {
    const obj = routes[key];
    const path = obj.path;
    const route = obj.router;
    app.use(path, route);
}

app.use(function(req, res) {
    res.status(404).render('404');
});

app.listen(port, function() {
    console.log(`Server is running on : ${url}`);
});

/* ----- MQTT ----- */

/*var client = mqtt.connect('mqtt://127.0.0.1::1883');

client.on('connect', function() {
    console.log('MQTT connecé');

    client.subscribe()
})*/