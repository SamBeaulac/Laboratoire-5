/*
 * @file index.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Route principale avec gestion MQTT et Socket.IO pour la synchronisation des items
 */

const express = require('express');
const itemList = require('../models/itemListSingleton');
var mqtt = require('mqtt');

const router = express.Router();

let io = null;

router.setIo = function(_io) {
    io = _io;
};

/* ----- GET ----- */
router.get('/', function(req, res) {
    const erreur = req.query.erreur === '1';
    res.render('index', { items: itemList.table, erreur });
});

/* ----- MQTT ----- */
var client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on('connect', function() {
    console.log('MQTT connected');
})

client.subscribe('ITEM/MODULE/#', function(err) {
    if(!err)
    {
        console.log('Subscribed to ITEM/MODULE/#');
    }
})

// Réception des messages
client.on('message', function(topic, message) {
    const cmd = message.toString();
    const ligne = cmd.split('\n');
    
    const parts = topic.split('/');
    const section = parts[1];
    const action = parts[2];
    const id = parts[3];

    if(section === 'MODULE' && action === 'NEW')
    {
        const nom = ligne[0];
        const prix = parseFloat(ligne[1]);
        const finalId = itemList.getLastItemId() + 1;
        const newItem = itemList.addItem(finalId, nom, prix);
        if(io) 
        {
            io.sockets.emit('itemAdded', newItem);
        }
    }
    else if(section === 'MODULE' && action === 'DELETE')
    {
        if(id === 'ID')
        {
            const deleteId = parseInt(ligne[0], 10);
            itemList.removeItemById(deleteId);
            if(io) 
            {
                io.sockets.emit('itemRemovedById', { id: deleteId });
            }
        }
        else if(id === 'NAME')
        {
            const nom = String(ligne[0]);
            itemList.removeItemByName(nom);
            if(io) 
            {
                io.sockets.emit('itemRemovedByName', { nom });
            }
        }
    }
    else if(section === 'MODULE' && action === 'MODIFY')
    {
        const modId = parseInt(ligne[0], 10);
        const modNom = ligne[1];
        const modPrix = parseFloat(ligne[2]);
        
        const modifiedItem = itemList.modifyItem(modId, modNom, modPrix);
        if (modifiedItem && io) 
        {
            io.sockets.emit('itemModified', modifiedItem);
        }
    }
});

/* ----- POST ----- */
var nextId = 1;

router.post('/', function(req, res) {
    const body = req.body;
    const action = body.action;

    let erreur = 0;

    if(action === 'rmById')
    {
        const rmId = parseInt(body.rmId, 10);
        var removed = itemList.removeItemById(rmId);
        if (removed) 
        {
            client.publish('ITEM/WEB/DELETE/ID', String(rmId));
            if(io) 
            {
                io.sockets.emit('itemRemovedById', { id: rmId });
            }
        } 
        else 
        {
            erreur = 1;
        }
    }
    else if(action === 'rmByName')
    {
        const rmNom = body.rmNom;
        var removedName = itemList.removeItemByName(rmNom);
            if (removedName) 
            {
                client.publish('ITEM/WEB/DELETE/NAME', rmNom);
                if(io) 
                {
                    io.sockets.emit('itemRemovedByName', { nom: rmNom });
                }
            } 
            else 
            {
                erreur = 1;
            }
    }
    else if(action === 'add') 
    {
        const addNom = body.addNom;
        const addPrix = body.addPrix;
        
        if (!addNom || addNom.trim() === '' || !addPrix || addPrix.trim() === '' || isNaN(parseFloat(addPrix))) 
        {
            erreur = 1;
        } 
        else 
        {
            const newItem = itemList.addItem(nextId, addNom.trim(), parseFloat(addPrix));
            
            if(io) 
            {
                io.sockets.emit('itemAdded', newItem);
            }
            
            const message = `${newItem.nom}\n${newItem.prix}`;
            client.publish('ITEM/WEB/NEW', message);
            nextId++;
        }
    }
    else if(action === 'mod') 
    {
        const modId = parseInt(body.modId, 10);
        const modNom = body.modNom;
        const modPrix = body.modPrix;
        
        if (!modNom || modNom.trim() === '' || !modPrix || modPrix.trim() === '' || isNaN(parseFloat(modPrix)) || isNaN(modId)) 
        {
            erreur = 1;
        } 
        else 
        {
            const modifiedItem = itemList.modifyItem(modId, modNom.trim(), parseFloat(modPrix));
            
            if (modifiedItem) 
            {
                if(io) 
                {
                    io.sockets.emit('itemModified', modifiedItem);
                }
                
                const message = `${modifiedItem.id}\n${modifiedItem.nom}\n${modifiedItem.prix}`;
                client.publish('ITEM/WEB/MODIFY', message);
            } 
            else 
            {
                erreur = 1;
            }
        }
    }
    
    console.log(itemList);
    if(erreur)
    {
        console.log("Une erreur est survenue");
        return res.redirect('/?erreur=1');
    }
    res.redirect('/');
});

module.exports = router;