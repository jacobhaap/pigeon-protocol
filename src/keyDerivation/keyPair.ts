import { bip39 } from "jsr:@iacobus/bip39@2.0.0";
import { generateMnemonic } from "./utils/mnemonic.ts";
import { deriveKey } from "./utils/deriveKey.ts";
import { x25519 } from "jsr:@noble/curves@1.8.1/ed25519";
import { Buffer } from "node:buffer";

export type MnemonicKeyPair = {
    mnemonic: string,
    privateKey: string,
    publicKey: string
};

/** Derives a {@link x25519} public key from a 32 byte private scalar of the private key. */
function getPublicKey(privateKey: string): string {
    const privateScalar: string = privateKey.slice(0, 64);
    const publicKey: Uint8Array = x25519.getPublicKey(privateScalar);
    return Buffer.from(publicKey).toString('hex');
};

/** 
 * Creates or regenerates a mnemonic key pair. When no mnemonic phrase is provided, a new phrase is generated
 * with {@link generateMnemonic}. A private key is derived using {@link deriveKey}, and a public key is derived
 * using {@link getPublicKey}.
 */
export function createKeyPair(providedMnemonic: string | null = null): MnemonicKeyPair {
    let mnemonic: string | null = providedMnemonic;
    let privateKey: string;
    let publicKey: string;

    if (mnemonic) {
        if (mnemonic.split(' ').length !== 15) {
            throw new Error(`Mnemonic phrase must be '15' words in length.`)
        }
        if (!bip39.core.validate(bip39.wordlist.english, mnemonic)) {
            throw new Error(`Provided mnemonic phrase failed validation.`);
        }
    } if (!mnemonic) {
        mnemonic = generateMnemonic();
    }

    try {
        privateKey = deriveKey(mnemonic);
        publicKey = getPublicKey(privateKey);
    } catch (error) {
        throw error;
    }
    
    return { mnemonic, privateKey, publicKey }
};
