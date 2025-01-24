import { randomBytes, createCipheriv } from "node:crypto";
import type { CipherGCMTypes, CipherKey, BinaryLike, CipherGCM } from "node:crypto";
import { Buffer } from "node:buffer";

export type encryptedKeyObject = {
    encryptedSymmetricKey: string,
    authTag: string,
    iv: string
};

/**
 * Derives cyphertext of a symmetric key from a cypher created with {@link createCipheriv} using the 'aes-256-gcm'
 * algorithm, a shared secret as the encryption key, and an initialization vector (IV) of 16 {@link randomBytes}.
 * The cyphertext of the symmetric key and an authentication tag are derived from the cypher.
 */
export function encryptSymmetricKey(symmetricKey: string, sharedSecret: Buffer): encryptedKeyObject {
    const algorithm: CipherGCMTypes = 'aes-256-gcm';
    const key: CipherKey = sharedSecret;
    const iv: BinaryLike = randomBytes(16);

    const cypher: CipherGCM = createCipheriv(algorithm, key, iv);
    let encryptedSymmetricKey: string = cypher.update(symmetricKey, 'utf8', 'hex');
    encryptedSymmetricKey += cypher.final('hex');
    const authTag: string = cypher.getAuthTag().toString('hex');

    return {
        encryptedSymmetricKey: encryptedSymmetricKey,
        authTag: authTag,
        iv: Buffer.from(iv).toString('hex'),
    }
};
