import { base64 } from "jsr:@scure/base";
import { getSharedSecret } from "./encryption/utils/getSharedSecret.ts";
import { decryptSymmetricKey } from "./decryption/decryptSymmetricKey.ts";
import { decryptCyphertext } from "./decryption/decryptCyphertext.ts";
import { Buffer } from "node:buffer";

/** Function to decode the base64 string of the encryption to its individual components */
function base64ToComponents(base64String: string): string[] {
    const decodedArray: Uint8Array = base64.decode(base64String);
    const decodedString: string = Buffer.from(decodedArray).toString('utf-8');
    return decodedString.split(':');
};

/**
 * Decrypts an encryption from a public key and a private key. This first decodes the base64 string of the encryption
 * and separates it into components using {@link base64ToComponents}, extracting the cyphertext, encrypted symmetric
 * key, and the IVs and authTags of each. The symmetric key is decrypted by deriving a shared secret with {@link getSharedSecret},
 * and using the shared secret to decrypt the symmetric key with {@link decryptSymmetricKey}. The symmetric key is then used to
 * decrypt the cyphertext using {@link decryptCyphertext}.
 */
export function createDecrypt(encrypted: string, publicKey: string, privateKey: string): string {
    const components = base64ToComponents(encrypted);
    
    const [
        cyphertext,
        inputAuthTag,
        inputIV,
        encryptedSymmetricKey,
        symmetricKeyAuthTag,
        symmetricKeyIV
    ]: string[] = components;

    const sender: string = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;

    // Symmetric Key Decryption
    const sharedSecret: Buffer = getSharedSecret(privateKey, sender);
    const symmetricKey: string = decryptSymmetricKey(encryptedSymmetricKey, sharedSecret, symmetricKeyIV, symmetricKeyAuthTag);

    // Input Decryption
    const decrypted: string = decryptCyphertext(cyphertext, symmetricKey, inputIV, inputAuthTag);
    
    return decrypted;
};
