const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');
const generateMnemonic = require('./utils/mnemonic');
const deriveKey = require('./utils/deriveKey');

function isValidKey(privateKey) {
    return privateKey.length === 32 && privateKey.some(byte => byte !== 0);
}

async function getPrivateKey(mnemonic) {
    const privateKey = await deriveKey(mnemonic);
    return privateKey;
}

async function getPublicKey(privateKey) {
    const { x25519 } = await import('@noble/curves/ed25519');
    const privateScalar = privateKey.slice(0, 64);
    let publicKey = x25519.getPublicKey(privateScalar);
    publicKey = Buffer.from(publicKey).toString('hex');
    return publicKey;
}

async function createKeyPair(providedMnemonic = null) {
    let valid = false;
    let mnemonic = providedMnemonic;

    if (mnemonic) {
        if (mnemonic.split(' ').length !== 15) {
            throw new Error(`Mnemonic phrase must be '15' words in length.`)
        }
        const valid = bip39.core.validate(wordlist, mnemonic);
        if (!valid) {
            throw new Error(`Provided mnemonic phrase failed validation.`);
        }
    } if (!mnemonic) {
        mnemonic = await generateMnemonic();
    }

    while (!valid) {
        try {
            const privateKey = await getPrivateKey(mnemonic);
            isValidKey(privateKey);
            valid = true;
            const publicKey = await getPublicKey(privateKey);
            return {
                mnemonic,
                privateKey,
                publicKey
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = createKeyPair;
