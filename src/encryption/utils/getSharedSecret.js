const { x25519 } = require('@noble/curves/ed25519');

function getSharedSecret(privateKeyHex, publicKeyHex) {
    let privateScalar = privateKeyHex.slice(0, 64);
    privateScalar = Buffer.from(privateScalar, 'hex');
    const publicKey = Buffer.from(publicKeyHex, 'hex');

    if (privateScalar.length !== 32 || publicKey.length !== 32) {
        throw new Error('Invalid key lengths for Curve25519');
    }

    const sharedSecret = x25519.scalarMult(privateScalar, publicKey);
    return Buffer.from(sharedSecret);
}

module.exports = getSharedSecret;
