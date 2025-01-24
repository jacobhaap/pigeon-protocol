import { x25519 } from "jsr:@noble/curves@1.8.1/ed25519";
import { Buffer } from "node:buffer";

/** ECDH key exchange to derive shared secret using {@link x25519}. */
export function getSharedSecret(privateKey: string, publicKey: string): Buffer {
    const privateScalar: Buffer = Buffer.from(privateKey.slice(0, 64), 'hex');
    const publicKeyBuffer: Buffer = Buffer.from(publicKey, 'hex');

    if (privateScalar.length !== 32 || publicKeyBuffer.length !== 32) {
        throw new Error(`Invalid key lengths for 'x25519'.`);
    }

    const sharedSecret: Uint8Array = x25519.scalarMult(privateScalar, publicKeyBuffer);
    return Buffer.from(sharedSecret);
};
