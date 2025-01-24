import { createKeyPair, type MnemonicKeyPair } from "./keyDerivation/keyPair.ts";

/** Creates an new or regenerates an existing identity with {@link createKeyPair}. */
export function createIdentity(providedMnemonic: string | null = null): MnemonicKeyPair {
    let mnemonic: string;
    let privateKey: string;
    let publicKey: string;
    try {
        const result: MnemonicKeyPair = createKeyPair(providedMnemonic);
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
