const crypto = require('crypto');

module.exports = {

    encrypt: function (text, salt) {
        var cipher = crypto.createCipher('aes-256-cbc', salt);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text, salt) {
        console.log('text', text);
        if (text === null || typeof text === 'undefined') { return text; };
        var decipher = crypto.createDecipher('aes-256-cbc', salt);
        var dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
};