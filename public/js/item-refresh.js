/*
 * @file item-refresh.js
 * @author Samuel
 * @date 10/07/2025
 * @brief Script client pour la mise à jour temps réel des items via Socket.IO
 */

$(document).ready(function() {
    if (typeof window.socket === 'undefined') {
        setTimeout(function() 
        {
            initializeSocketEvents();
        }, 1000);
    } 
    else 
    {
        initializeSocketEvents();
    }
    
    function initializeSocketEvents() {
        var socket = window.socket;
        
        if (!socket) {
            return;
        }
        
        socket.on('initList', function(items) {
            renderList(items);
        });

        socket.on('itemAdded', function(item) {
            var $tr = addItemRow(item);
            $('.item-list__tbody').append($tr);
        });

        socket.on('itemRemovedById', function(data) {
            rmItemRowById(data.id);
        });

        socket.on('itemRemovedByName', function(data) {
            rmItemRowByName(data.nom);
        });

        socket.on('itemModified', function(item) {
            rmItemRowById(item.id);
            var $tr = addItemRow(item);
            $('.item-list__tbody').append($tr);
        });
    }
});

function renderList(items) {
    var $tbody = $('.item-list__tbody');
    $tbody.empty();
    
    items.forEach(function(item) {
        var $tr = addItemRow(item);
        $tbody.append($tr);
    });
}

function addItemRow(item) {
    var id = item.id;
    var date = item.date;
    var nom = item.nom;
    var prix = item.prix;

    var $tr = $('<tr>').addClass('item-list__tr').attr('data-id', id).attr('data-nom', nom);
    $('<td>').addClass('item-list__td').text(id).appendTo($tr);
    $('<td>').addClass('item-list__td').text(date).appendTo($tr);
    $('<td>').addClass('item-list__td').text(nom).appendTo($tr);
    $('<td>').addClass('item-list__td').text('$' + prix).appendTo($tr);
    return $tr;
}

function rmItemRowById(id) {
    var $tbody = $('.item-list__tbody');
    $tbody.find('tr[data-id="' + id + '"]').remove();
}

function rmItemRowByName(nom) {
    var $tbody = $('.item-list__tbody');
    $tbody.find('tr[data-nom="' + nom + '"]').remove();
}

socket.on('itemModified', function(item) {
    console.log('Item modifié reçu via socket:', item);
    rmItemRowById(item.id);
    var $tr = addItemRow(item);
    $('.item-list__tbody').append($tr);
});