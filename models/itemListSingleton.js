/*
 * @file itemListSingleton.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Singleton ItemList pour partager une instance unique à travers l'application
 */

const ItemList = require('./itemList');
const itemList = new ItemList();
module.exports = itemList;