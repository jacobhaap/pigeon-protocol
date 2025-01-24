import { createDecipheriv } from "node:crypto";
import type { CipherGCMTypes, CipherKey, BinaryLike, DecipherGCM } from "node:crypto";
import { Buffer } from "node:buffer";

/**
 * Decrypts cyphertext of a string from a decypher created with {@link createDecipheriv} using the 'aes-256-gcm' algorithm,
 * a symmetric key as the decryption key, an initialization vector, and an authentication tag. The cyphertext is decrypted
 * using the decypher.
 */
export function decryptCyphertext(cyphertext: string, symmetricKey: string, iv: string, authTag: string): string {
    const algorithm: CipherGCMTypes = 'aes-256-gcm';
    const key: CipherKey = Buffer.from(symmetricKey, 'hex');
    const ivBuffer: BinaryLike = Buffer.from(iv, 'hex');
    const authTagBuffer: Buffer = Buffer.from(authTag, 'hex');

    const decypher: DecipherGCM = createDecipheriv(algorithm, key, ivBuffer);
    decypher.setAuthTag(authTagBuffer);
    let decyphertext: string = decypher.update(cyphertext, 'hex', 'utf8');
    decyphertext += decypher.final('utf8');

    return decyphertext;
};
