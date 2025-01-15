const crypto = require('crypto');
const getSymmetricKey = require('./utils/getSymmetricKey');

function createCyphertext(input, sharedSecret) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(getSymmetricKey(sharedSecret), 'hex');
    const iv = crypto.randomBytes(16);

    const cypher = crypto.createCipheriv(algorithm, key, iv);
    let cyphertext = cypher.update(input, 'utf8', 'hex');
    cyphertext += cypher.final('hex');
    const authTag = cypher.getAuthTag().toString('hex');

    return { 
        cyphertext: cyphertext,
        symmetricKey: key.toString('hex'),
        authTag: authTag,
        iv: iv.toString('hex'),
    };
}

module.exports = createCyphertext;
