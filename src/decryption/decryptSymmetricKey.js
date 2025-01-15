const crypto = require('crypto');

function decryptSymmetricKey(encryptedSymmetricKey, sharedSecret, iv, authTag) {

    if (!encryptedSymmetricKey || !sharedSecret || !iv || !authTag) {
        throw new Error('Missing required parameters for decryption');
    }

    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(sharedSecret, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');

    const decypher = crypto.createDecipheriv(algorithm, key, ivBuffer);

    decypher.setAuthTag(authTagBuffer);

    let symmetricKey = decypher.update(encryptedSymmetricKey, 'hex', 'utf8');
    symmetricKey += decypher.final('utf8');

    return symmetricKey;
}

module.exports = decryptSymmetricKey;
