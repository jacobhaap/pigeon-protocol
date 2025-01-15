const createIdentity = require('./createIdentity');
const createEncrypt = require('./createEncrypt');
const createDecrypt = require('./createDecrypt');

async function identity() {
    throw new Error(`Must select method: 'new' or 'regenerate'`);
}

identity = {
    new: async function() {
        return createIdentity();
    },
    regenerate: async function(mnemonic) {
        if (mnemonic != null) {
            return createIdentity(mnemonic);
        } else {
            throw new Error(`A 'mnemonic' must be provided to regenerate a key pair.`);
        }
    }
}

async function encrypt(input, privateKey, publicKey) {
    let senderKey;
    let recipientKey;

    try {
        // Determine Sender Key
        if (/^([A-Fa-f0-9]{2})+$/.test(privateKey)) {
            senderKey = privateKey;
        } else if (privateKey.split(' ').length === 15) {
            senderKeyPair = await identity.regenerate(privateKey);
            senderKey = senderKeyPair.privateKey;
        } else {
            throw new Error(`Sender 'privateKey' is invalid.`);
        }

        // Verify Recipient Key
        if (publicKey) {
            recipientKey = publicKey;
        } else {
            throw new Error(`Recipient 'publicKey' is required.`);
        }
    } catch (error) {
        throw error;
    }
    
    try {
        return createEncrypt(input, senderKey, recipientKey);
    } catch (error) {
        throw error;
    }
}

async function decrypt(encryptedInput, publicKey, privateKey) {
    let recipientKey;
    let senderKey;

    try {
        // Verify Sender Key
        if (publicKey) {
            senderKey = publicKey;
        } else {
            throw new Error(`Sender 'publicKey' is required.`)
        }

        // Determine Recipient Key
        if (/^([A-Fa-f0-9]{2})+$/.test(privateKey)) {
            recipientKey = privateKey;
        } else if (privateKey.split(' ').length === 15)  {
            recipientKeyPair = await identity.regenerate(privateKey);
            recipientKey = recipientKeyPair.privateKey;
        } else {
            throw new Error(`Recipient 'privateKey' is invalid.`)
        }
    } catch (error) {
        throw error;
    }

    try {
        return createDecrypt(encryptedInput, senderKey, recipientKey);
    } catch (error) {
        throw error;
    }
}

module.exports = { identity, encrypt, decrypt };
