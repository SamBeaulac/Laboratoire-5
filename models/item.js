/*
 * @file item.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Classe Item représentant un article avec ID, nom, prix et date de création
 */

class Item {
    constructor(id, nom, prix) {
        this.id = Number(id);
        this.date = getDateOfCreation(new Date());
        this.nom = String(nom);
        this.prix = parseFloat(prix);
    };
}

function getDateOfCreation(date)
{
    const annee = date.getFullYear();
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    const jour = date.getDate().toString().padStart(2, '0');
    return `${mois}/${jour}/${annee}`;
}

module.exports = Item;