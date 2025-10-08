/*
 * @file itemList.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Classe ItemList pour gérer une collection d'items avec méthodes CRUD
 */

const Item = require('./item');

class ItemList {
    constructor(table = []) 
    {
        this.table = table;
    }

    addItem(id, nom, prix) 
    {
        const item = new Item(id, nom, prix);
        this.table.push(item);
        return item;
    }

    getLength() 
    {
        return this.table.length;
    }

    removeItemById(id) {
        const idx = this.table.findIndex(function(item) {
            return Number(item.id) === Number(id);
        });
        if (idx === -1) 
        {
            return 0;
        }
        const removed = this.table.splice(idx, 1)[0];
        return removed;
    }

    removeItemByName(nom) {
        const idx = this.table.findIndex(function(item) {
            return String(item.nom) === String(nom);
        });
        if(idx === -1)
        {
            return 0;
        }
        const removed = this.table.splice(idx, 1)[0];
        return removed;
    }

    getLastItemId() {
        if(this.table.length === 0) 
        {
            return 0;
        }

        var max = 0;
        for(var i = 0; i < this.table.length; i++) 
        {
            var idNum = Number(this.table[i].id) || 0;
            if (idNum > max) max = idNum;
        }
        return max;
    }

    getLastItem() {
        if(this.table.length === 0) 
        {
            return 0;
        }
        return this.table[this.table.length - 1];
    }

    modifyItem(id, newNom, newPrix) {
        const item = this.table.find(item => Number(item.id) === Number(id));
        if (item) {
            item.nom = newNom;
            item.prix = newPrix;
            return item;
        }
        return null;
    }
}

module.exports = ItemList;