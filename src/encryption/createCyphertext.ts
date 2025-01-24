import { randomBytes, createCipheriv } from "node:crypto";
import type { CipherGCMTypes, CipherKey, BinaryLike, CipherGCM } from "node:crypto";
import { Buffer } from "node:buffer";
import { getSymmetricKey } from "./utils/getSymmetricKey.ts";

export type CyphertextObject = {
    cyphertext: string,
    symmetricKey: string,
    authTag: string,
    iv: string
}

/**
 * Derives cyphertext of a string from a cypher created with {@link createCipheriv} using the 'aes-256-gcm' algorithm,
 * a symmetric key as the encryption key, and an initialization vector (IV) of 16 {@link randomBytes}. The
 * cyphertext and an authentication tag are derived from the cypher.
 */
export function createCyphertext(inputStr: string, sharedSecret: Buffer): CyphertextObject {
    const algorithm: CipherGCMTypes = 'aes-256-gcm';
    const key: CipherKey = getSymmetricKey(sharedSecret);
    const iv: BinaryLike = randomBytes(16);

    const cypher: CipherGCM = createCipheriv(algorithm, key, iv);
    let cyphertext: string = cypher.update(inputStr, 'utf8', 'hex');
    cyphertext += cypher.final('hex');
    const authTag: string = cypher.getAuthTag().toString('hex');

    return { 
        cyphertext: cyphertext,
        symmetricKey: Buffer.from(key).toString('hex'),
        authTag: authTag,
        iv: Buffer.from(iv).toString('hex'),
    };
};
