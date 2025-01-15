const createCyphertext = require('./encryption/createCyphertext');
const getSharedSecret = require('./encryption/utils/getSharedSecret');
const encryptSymmetricKey = require('./encryption/encryptSymmetricKey');
const { base64 } = require('@scure/base');

function createEncrypt(input, senderPrivateKey, recipientPublicKey) {

    const recipient = recipientPublicKey.startsWith('0x') ? recipientPublicKey.slice(2) : recipientPublicKey;
    
    // Obtain Shared Secret
    const sharedSecret = getSharedSecret(senderPrivateKey, recipient);

    // Input Encryption
    const inputEncryption = createCyphertext(input, sharedSecret);
    const cyphertext = inputEncryption.cyphertext;
    const symmetricKey = inputEncryption.symmetricKey;
    const inputAuthTag = inputEncryption.authTag;
    const inputIV = inputEncryption.iv;

    // Symmetric key Encryption
    const symmetricKeyEncryption = encryptSymmetricKey(symmetricKey, sharedSecret);
    const encryptedSymmetricKey = symmetricKeyEncryption.encryptedSymmetricKey;
    const symmetricKeyAuthTag = symmetricKeyEncryption.authTag;
    const symmetricKeyIV = symmetricKeyEncryption.iv;

    let result = [
        cyphertext,
        inputAuthTag,
        inputIV,
        encryptedSymmetricKey,
        symmetricKeyAuthTag,
        symmetricKeyIV
    ].join(':');
    
    const resultBuffer = Buffer.from(result, 'utf8');
    result = base64.encode(resultBuffer);
    return result;
}

module.exports = createEncrypt;
