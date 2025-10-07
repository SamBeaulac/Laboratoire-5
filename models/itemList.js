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
    }

    getLength() 
    {
        return this.table.length;
    }

    removeItemById(id) {
        this.table = this.table.filter(function(item) 
        {
            return item.id !== id;
        });
    }

    removeItemByName(nom) {
        this.table = this.table.filter(function(item) 
        {
            return item.nom !== nom;
        });
    }

    getLastItemId() {
        if (this.table.length === 0) 
        {
            return null;
        }
        return this.table[this.table.length - 1].id;
    }

    getLastItem() {
        if(this.table.length === 0) 
        {
            return null;
        }
        return this.table[this.table.length - 1];
    }
}

module.exports = ItemList;