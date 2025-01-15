const { bip39 } = require('@iacobus/bip39');
const { wordlist } = require('@iacobus/bip39/wordlists/english');
const crypto = require('crypto');

async function deriveKey(mnemonic) {
    try {
        const validate = bip39.core.validate(wordlist, mnemonic);
        if (validate) {
            const password = mnemonic.normalize('NFKD');
            const salt = crypto.createHash('sha256').update(password).digest();

            let cryptographicKey = crypto.pbkdf2Sync(password, salt, 210000, 64, 'sha512');
            return cryptographicKey.toString('hex');

        }
    } catch (error) {
        throw error;
    }
}

module.exports = deriveKey;
