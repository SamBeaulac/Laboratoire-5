const express = require('express');
const ItemList = require('../models/itemList');
const itemList = new ItemList();

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

    if(action === 'rmById')
    {
        const rmId = parseInt(body.rmId, 10);
        if(!Number.isNaN(rmId))
        {
            itemList.removeItemById(id);
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
            itemList.addItem(nextId++, addNom, addPrix);
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