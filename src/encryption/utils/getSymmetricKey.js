const crypto = require('crypto');

function getSymmetricKey(sharedSecret) {
    const salt = crypto.randomBytes(16);
    const symmetricKey = crypto.hkdfSync('sha256', sharedSecret, salt, '', 32);

    return symmetricKey;
}

module.exports = getSymmetricKey;
