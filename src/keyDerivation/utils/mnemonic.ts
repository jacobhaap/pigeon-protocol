import { randomBytes }from "node:crypto"
import { bip39 } from "jsr:@iacobus/bip39@2.0.0";
import type { Buffer } from "node:buffer";

/** Derives a mnemonic phrase from 20 bytes of entropy with {@link bip39} at a phrase length of 15 words. */
export function generateMnemonic(): string {
    const entropyBuffer: Buffer = randomBytes(20);

    let ent: string = bip39.ent.fromBuffer(entropyBuffer);
    ent = ent.slice(0, 160);

    try {
        const mnemonic: string = bip39.core.toMnemonic(bip39.wordlist.english, ent);
        return mnemonic;
    } catch (error) {
        throw error;
    }
};
