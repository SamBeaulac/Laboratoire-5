const express = require('express');
const itemList = require('../models/itemListSingleton');

const router = express.Router();

router.get('/', function(req, res) {
    const erreur = req.query.erreur === '1';
    res.render('index', { items: itemList.table, erreur });
});

var nextId = 1;

router.post('/', function(req, res) {
    const body = req.body;
    const action = body.action;

    let erreur = 0;

    const client = req.app && req.app.locals && req.app.locals.mqttClient;

    if(action === 'rmById')
    {
        const rmId = parseInt(body.rmId, 10);
        if(!Number.isNaN(rmId))
        {
            itemList.removeItemById(rmId);

            if(client) 
            {
                client.publish('ITEM/WEB/DELETE/ID', rmId.toString(), function(err) {
                if(err)
                {
                    console.log(err);
                }});
            } 
            else 
            {
                console.warn('MQTT client non disponible');
            }
        }
        else
        {
            erreur = 1;
        }
        
    }
    else if(action === 'rmByName')
    {
        const rmNom = String(body.rmNom || '').trim();
        if(rmNom)
        {
            itemList.removeItemByName(rmNom);

             if(client) 
            {
                client.publish('ITEM/WEB/DELETE/NAME', rmNom, function(err) {
                if(err)
                {
                    console.log(err);
                }});
            } 
            else 
            {
                console.warn('MQTT client non disponible');
            }
        }
        else
        {
            erreur = 1;
        }
    }
    else if(action === 'add') 
    {
        const addNom = String(body.addNom);
        const addPrix = parseFloat(body.addPrix);
        if(addNom)
        {
            itemList.addItem(nextId, addNom, addPrix);

            if(client) 
            {
                const newItem = itemList.getLastItem();
                const message = `${newItem.id}\n${newItem.date}\n${newItem.nom}\n${newItem.prix}`;
                client.publish('ITEM/WEB/NEW', message, function(err) {
                if(err)
                {
                    console.log(err);
                }});
            } 
            else 
            {
                console.warn('MQTT client non disponible');
            }

            nextId++;
        }
        else
        {
            erreur = 1;
        }
    }
    
    console.log(itemList);
    if(erreur)
    {
        console.log("Une erreur est survenue");
        return res.redirect('/?erreur=1');
    }
    res.redirect('/');
})

module.exports = router;