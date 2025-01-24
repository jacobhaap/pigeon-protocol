import { createDecipheriv } from "node:crypto";
import type { CipherGCMTypes, CipherKey, BinaryLike, DecipherGCM } from "node:crypto";
import { Buffer } from "node:buffer";

/**
 * Decrypts the cyphertext of a symmetric key from a decypher created with {@link createDecipheriv} using the 'aes-256-gcm'
 * algorithm, a shared secret as the decryption key, an initialization vector, and an authentication tag. The cyphertext is
 * decrypted using the decypher.
 */
export function decryptSymmetricKey(encryptedSymmetricKey: string, sharedSecret: Buffer, iv: string, authTag: string): string {
    const algorithm: CipherGCMTypes = 'aes-256-gcm';
    const key: CipherKey = sharedSecret;
    const ivBuffer: BinaryLike = Buffer.from(iv, 'hex');
    const authTagBuffer: Buffer = Buffer.from(authTag, 'hex');

    const decypher: DecipherGCM = createDecipheriv(algorithm, key, ivBuffer);
    decypher.setAuthTag(authTagBuffer);
    let symmetricKey: string = decypher.update(encryptedSymmetricKey, 'hex', 'utf8');
    symmetricKey += decypher.final('utf8');

    return symmetricKey;
};
