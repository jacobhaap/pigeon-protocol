const { base64 } = require('@scure/base');
const getSharedSecret = require('./encryption/utils/getSharedSecret');
const decryptSymmetricKey = require('./decryption/decryptSymmetricKey');
const decryptCyphertext = require('./decryption/decryptCyphertext');

function base64ToComponents(base64String) {
    const decodedArray = base64.decode(base64String);
    const decodedString = Buffer.from(decodedArray).toString('utf-8');
    return decodedString.split(':');
}

function createDecrypt(encryptedInput, senderPublicKey, recipientPrivateKey) {
    const components = base64ToComponents(encryptedInput);
    
    const [
        cyphertext,
        inputAuthTag,
        inputIV,
        encryptedSymmetricKey,
        symmetricKeyAuthTag,
        symmetricKeyIV
    ] = components;

    const sender = senderPublicKey.startsWith('0x') ? senderPublicKey.slice(2) : senderPublicKey;

    // Symmetric Key Decryption
    const sharedSecret = getSharedSecret(recipientPrivateKey, sender);
    const symmetricKey = decryptSymmetricKey(encryptedSymmetricKey, sharedSecret, symmetricKeyIV, symmetricKeyAuthTag);

    // Input Decryption
    const decryptedInput = decryptCyphertext(cyphertext, symmetricKey, inputIV, inputAuthTag);
    
    return decryptedInput;
}

module.exports = createDecrypt;
