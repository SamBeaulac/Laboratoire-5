/*
 * @file about.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Route pour la page À propos de l'application
 */

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    console.log(req.originalUrl, req.url);
    res.render('about');
});

module.exports = router;