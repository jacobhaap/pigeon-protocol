const crypto = require('crypto');

function encryptSymmetricKey(symmetricKey, sharedSecret) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(sharedSecret, 'hex');
    const iv = crypto.randomBytes(16);

    const cypher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedSymmetricKey = cypher.update(symmetricKey, 'utf8', 'hex');
    encryptedSymmetricKey += cypher.final('hex');
    const authTag = cypher.getAuthTag().toString('hex');

    return {
        encryptedSymmetricKey: encryptedSymmetricKey,
        authTag: authTag,
        iv: iv.toString('hex'),
    }
}

module.exports = encryptSymmetricKey;
