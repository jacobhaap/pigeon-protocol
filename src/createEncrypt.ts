import { createCyphertext, type cyphertextObject } from "./encryption/createCyphertext.ts";
import { getSharedSecret } from "./encryption/utils/getSharedSecret.ts";
import { encryptSymmetricKey, type encryptedKeyObject } from "./encryption/encryptSymmetricKey.ts";
import { base64 } from "jsr:@scure/base";
import { Buffer } from "node:buffer";

/**
 * Creates an encryption from a string, private key, and a public key. This first derives a shared secret between the private key
 * and public key using {@link getSharedSecret}, which is then used during the encryption of the provided string using {@link createCyphertext}.
 * The symmetric key from encryption is then itself encrypted using {@link encryptSymmetricKey} using the shared secret. Finally, both
 * encryptions together with their IVs and authTags are concatenated into a {@link base64} encoded string.
 */
export function createEncrypt(inputStr: string, privateKey: string, publicKey: string): string {
    const recipient: string = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
    
    // Obtain Shared Secret
    const sharedSecret: Buffer = getSharedSecret(privateKey, recipient);

    // Input Encryption
    const inputEncryption: cyphertextObject = createCyphertext(inputStr, sharedSecret);
    const cyphertext: string = inputEncryption.cyphertext;
    const symmetricKey: string = inputEncryption.symmetricKey;
    const inputAuthTag: string = inputEncryption.authTag;
    const inputIV: string = inputEncryption.iv;

    // Symmetric key Encryption
    const symmetricKeyEncryption: encryptedKeyObject = encryptSymmetricKey(symmetricKey, sharedSecret);
    const encryptedSymmetricKey: string = symmetricKeyEncryption.encryptedSymmetricKey;
    const symmetricKeyAuthTag: string = symmetricKeyEncryption.authTag;
    const symmetricKeyIV:string = symmetricKeyEncryption.iv;

    let result: string = [
        cyphertext,
        inputAuthTag,
        inputIV,
        encryptedSymmetricKey,
        symmetricKeyAuthTag,
        symmetricKeyIV
    ].join(':');
    
    const resultBuffer: Buffer = Buffer.from(result, 'utf8');
    result = base64.encode(resultBuffer);
    return result;
};
