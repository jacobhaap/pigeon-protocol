import { createIdentity } from "./createIdentity.ts";
import type { MnemonicKeyPair } from "./keyDerivation/keyPair.ts";
import { createEncrypt } from "./createEncrypt.ts";
import { createDecrypt } from "./createDecrypt.ts";

export type { MnemonicKeyPair } from "./keyDerivation/keyPair.ts";

type Identity = {
    invoke: () => never;
    new: () => MnemonicKeyPair;
    regenerate: (mnemonic: string) => MnemonicKeyPair;
};


/** Create a new or regenerate an existing identity using {@link createIdentity}. */
export const identity: Identity = {
    invoke() {
        throw new Error(`'identity' requires a method: 'new' or 'regenerate'`);
    },
    /** Create a new identity. */
    new(): MnemonicKeyPair {
        return createIdentity();
    },
    /** Regenerate an existing identity from a mnemonic phrase. */
    regenerate(mnemonic: string): MnemonicKeyPair {
        if (!mnemonic) {
            throw new Error(`A 'mnemonic' must be provided to regenerate a key pair.`);
        }
        return createIdentity(mnemonic);
    }
};

/**
 * Create an encryption of a string with a private key and a public key using {@link createEncrypt}.
 * This function treats the private key as the "sender" and the public key as the "recipient".
 * A mnemonic phrase can be used as a private key.
 */
export function encrypt(inputStr: string, privateKey: string, publicKey: string): string {
    let senderKey: string;
    let recipientKey: string;

    try {
        // Determine Sender Key
        if (/^([A-Fa-f0-9]{2})+$/.test(privateKey)) {
            senderKey = privateKey;
        } else if (privateKey.split(' ').length === 15) {
            const senderKeyPair: MnemonicKeyPair = identity.regenerate(privateKey);
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
        return createEncrypt(inputStr, senderKey, recipientKey);
    } catch (error) {
        throw error;
    }
};

/**
 * Decrypt an encryption string with a public key and a private key using {@link createDecrypt}.
 * This function treats the public key as the "sender" and the private key as the "recipient",
 * though this may be reversed (sender can decrypt their own encryption with the recipient public key).
 * A mnemonic phrase can be used as a private key.
 */
export function decrypt(encrypted: string, publicKey: string, privateKey: string): string {
    let recipientKey: string;
    let senderKey: string;

    try {
        // Verify Sender Key
        if (publicKey) {
            senderKey = publicKey;
        } else {
            throw new Error(`Sender 'publicKey' is required.`);
        }

        // Determine Recipient Key
        if (/^([A-Fa-f0-9]{2})+$/.test(privateKey)) {
            recipientKey = privateKey;
        } else if (privateKey.split(' ').length === 15)  {
            const recipientKeyPair: MnemonicKeyPair = identity.regenerate(privateKey);
            recipientKey = recipientKeyPair.privateKey;
        } else {
            throw new Error(`Recipient 'privateKey' is invalid.`);
        }
    } catch (error) {
        throw error;
    }

    try {
        return createDecrypt(encrypted, senderKey, recipientKey);
    } catch (error) {
        throw error;
    }
};
