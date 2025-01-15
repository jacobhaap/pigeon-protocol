const crypto = require('crypto');
const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');

async function generateMnemonic() {
    const entropyBuffer = crypto.randomBytes(20);

    let ent = bip39.ent.fromBuffer(entropyBuffer);
    ent = ent.slice(0, 160);

    try {
        const mnemonic = bip39.core.toMnemonic(wordlist, ent);
        return mnemonic;
    } catch (error) {
        throw error;
    }
}

module.exports = generateMnemonic;
