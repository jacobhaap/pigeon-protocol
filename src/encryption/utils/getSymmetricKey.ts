import { randomBytes, hkdfSync } from "node:crypto";
import { Buffer } from "node:buffer";

/** Derive a symmetric key with {@link hkdfSync} from a shared secret. */
export function getSymmetricKey(sharedSecret: Buffer): Buffer {
    const salt: Buffer = randomBytes(16);
    const symmetricKey: Buffer = Buffer.from(hkdfSync('sha256', sharedSecret, salt, '', 32));

    return symmetricKey;
};
