const crypto = require('crypto');

function decryptCyphertext(cyphertext, symmetricKey, iv, authTag) {

    if (!cyphertext || !symmetricKey || !iv || !authTag) {
        throw new Error('Missing required parameters for decryption');
    }

    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(symmetricKey, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decypher = crypto.createDecipheriv(algorithm, key, ivBuffer);

    decypher.setAuthTag(authTagBuffer);

    let decypheredText = decypher.update(cyphertext, 'hex', 'utf8');
    decypheredText += decypher.final('utf8');

    return decypheredText;
}

module.exports = decryptCyphertext;
