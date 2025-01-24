import { createHash, pbkdf2Sync } from "node:crypto"
import { bip39 } from "jsr:@iacobus/bip39";
import type { Buffer } from "node:buffer";

/** Derives a deterministic cryptographic key with {@link pbkdf2Sync} at a key length of 64 bytes. */
export function deriveKey(mnemonic: string): string {
    let cryptographicKey: Buffer | undefined;
    try {
        const validate: boolean = bip39.core.validate(bip39.wordlist.english, mnemonic);
        if (validate) {
            const password: string = mnemonic.normalize('NFKD');
            const salt: Buffer = createHash('sha256').update(password).digest();

            cryptographicKey = pbkdf2Sync(password, salt, 210000, 64, 'sha512');
        }
    } catch (error) {
        throw error;
    }
    if (!cryptographicKey) {
        throw new Error(`Failed to derive cryptographic key.`);
    }
    return cryptographicKey.toString('hex');
};
