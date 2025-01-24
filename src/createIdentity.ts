import { createKeyPair, type mnemonicKeyPair } from "./keyDerivation/keyPair.ts";

/** Creates an new or regenerates an existing identity with {@link createKeyPair}. */
export function createIdentity(providedMnemonic: string | null = null): mnemonicKeyPair {
    let mnemonic: string;
    let privateKey: string;
    let publicKey: string;
    try {
        const result: mnemonicKeyPair = createKeyPair(providedMnemonic);
        mnemonic = result.mnemonic;
        privateKey = result.privateKey;
        publicKey= "0x" + result.publicKey;
    } catch (error) {
        throw error;
    }
    return {
        mnemonic,
        privateKey,
        publicKey
    }
};
