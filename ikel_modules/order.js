'use strict';

var isEmpty = require('./commons.js').isEmpty;

module.exports = function() {
    var OrderFactory = function(order) {
        if (!order.from || !order.from.name) {
            throw {
                code: 400,
                message: 'Restaurant name not specified. Please specify a non-empty restaurant name.'
            };
        }
        if (isEmpty(order.author)) {
            throw {
                code: 400,
                message: 'Author\'s name not specified. Please specify a non-empty name for the person opening this order.'
            };
        }
        if (isEmpty(order.email)) {
            throw {
                code: 400,
                message: 'E-mail not specified. Please specify a non-empty e-mail for this order.'
            };
        }
        return {
            from: {
                name: order.from.name,
                address: order.from.address
            },
            author: order.author,
            email: order.email,
            menuLink: order.menuLink
        };
    };
    return {
        Order: {
            construct: OrderFactory
        }
    };
}();