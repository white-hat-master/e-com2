const crypto = require('crypto');

function mycrypto()
{
    this.myencrypt =(data)=>{
        var myKey = crypto.createCipher('aes-128-cbc', 'mypassword');
        var mystr = myKey.update(data, 'utf8','hex');
        mystr += myKey.final('hex');
        return mystr
    }

    this.mydecrypt =(data)=>{
        var myKey = crypto.createDecipher('aes-128-cbc', 'mypassword');

        var mystr = myKey.update(data, 'utf8','hex');
        mystr += myKey.final('utf8');
        return mystr
    }
}

module.exports = new mycrypto();