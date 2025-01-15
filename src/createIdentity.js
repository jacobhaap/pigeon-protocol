const createKeyPair = require('./keyDerivation/keyPair');

async function createIdentity(providedMnemonic = null) {
    try {
        const result = await createKeyPair(providedMnemonic);
        const mnemonic = result.mnemonic;
        const privateKey = result.privateKey;
        const publicKey = "0x" + result.publicKey;
        return {
            mnemonic,
            privateKey,
            publicKey
        };
    } catch (error) {
        throw error;
    }
}

module.exports = createIdentity;
