const express = require('express');
const path = require('path');
var mqtt = require('mqtt');
const itemList = require('./models/itemListSingleton');

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

var client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', function() {
    console.log('MQTT connected');
})

client.subscribe('ITEM/WEB/#', function(err) {
    if(!err)
    {
        console.log('Abonné à ITEM/WEB/#');
    }
})

client.on('message', function(topic, message) {
    const cmd = message.toString();
    const ligne = cmd.split('\n');
    
    console.log(ligne);
    
    const parts = topic.split('/'); // ITEM / WEB / NEW 
    const section = parts[2];
    const action = parts[3];

    if(section === 'NEW')
    {
        if(ligne.length >= 1)
        {
            const nom = String(ligne[0]);
            const prix = parseFloat(ligne[1]);
            const finalId = itemList.getLastItemId() + 1;
            itemList.addItem(finalId, nom, prix);
            console.log(itemList);
        }
    }
    else if(section === 'DELETE')
    {
        if(action === 'ID')
        {
            if(ligne.length >= 1)
            {
                const id = parseInt(ligne[0], 10);
                if(!Number.isNaN(id)) 
                {
                    itemList.removeItemById(id);
                }

            }
        }
        else if(action === 'NAME')
        {
            if(ligne.length >= 1)
            {
                const nom = String(ligne[0]);
                itemList.removeItemByName(nom);

            }
        }
    }
});


app.locals.mqttClient = client;