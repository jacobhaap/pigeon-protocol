# Pigeon Protocol

![NPM Version](https://img.shields.io/npm/v/pigeon-protocol) ![GitLab License](https://img.shields.io/gitlab/license/jacobhaap%2Fpigeon-protocol) ![NPM Type Definitions](https://img.shields.io/npm/types/%40iacobus%2Fbip39) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/pigeon-protocol)

> Pigeon Protocol for end-to-end encryption.

The **Pigeon Protocol** is an end-to-end encryption protocol that combines Elliptic-curve Diffie–Hellman (ECDH) key exchange and symmetric key encryption, utilizing Curve25519, AES-256-GCM, and HKDF-SHA256 as cryptographic primitives.

Natively in **TypeScript**, with **ESM** and **CommonJS** compatibility. To get started, install the library:
```bash
# Deno
deno add jsr:@jacobhaap/pigeon-protocol

# Node.js
npm install pigeon-protocol
```
# Usage
TypeScript/ESM import:
```ts
import { identity, encrypt, decrypt } from "pigeon-protocol";
```

CommonJS require:
```js
const { identity, encrypt, decrypt } = require("pigeon-protocol");
```

For TypeScript, `mnemonicKeyPair` import type:
```ts
import type { mnemonicKeyPair } from "jsr:@jacobhaap/pigeon-protocol";
```

For demonstration purposes, functions and their parameters with types will be displayed in TypeScript, and the example use of the library will be displayed in ESM.

The `mnemonicKeyPair` type is a custom type for an object containing a mnemonic phrase, private key, and public key.
```ts
type mnemonicKeyPair = {
    mnemonic: string,
    privateKey: string,
    publicKey: string
};
```

## Identity
A new identity can be created or an existing identity regenerated with the `new` or `regenerate` methods of `identity`.
```ts
// New Identity
identity.new():  mnemonicKeyPair {};

// Regenerate Existing Identity
identity.regenerate(mnemonic:  string):  mnemonicKeyPair {};
```

 An identity consists of a mnemonic phrase, and public & private key pair. When using the `.new` method, no parameters are expected, and a new identity is returned. When using the `.regenerate` method, a `mnemonic` parameter is provided to regenerate the associated private and public keys, returning the regenerated identity.

*Example use, creating a new identity:*
```js
import { identity } from "pigeon-protocol";

const credentials = identity.new();
console.log(credentials);

```

*Example use, regenerating an identity from a mnemonic:*
```js
import { identity } from "pigeon-protocol";

const mnemonic = "they extra sock cost debris swim release supply illegal crush awful project exact genuine rather";
const credentials = identity.regenerate(mnemonic);
console.log(credentials);

```

## Encryption & Decryption
Encryption and decryption are based on the `encrypt` and `decrypt` functions, designed for the encryption and decryption of strings between a sender and a recipient. In both encryption and decryption, the private key can either be provided as the key itself, or as a mnemonic phrase.
```ts
encrypt(inputStr:  string, privateKey:  string, publicKey:  string):  string {};
```
For encryption, a target input string (`inputStr`) along with a private key (sender) and public key (recipient) are expected to be provided as parameters. The resulting encryption is returned as a base64 encoded string.
```ts
decrypt(encrypted:  string, publicKey:  string, privateKey:  string):  string {};
```
For decryption, a base64 encoded encryption string (`encrypted`), along with a public key (sender) and a private key (recipient) are expected to be provided as parameters. The sender may also decrypt their own encryption by providing the recipient's public key and their own private key. The resulting decryption is returned as a string.

*Example use, encrypting message:*
```js
import { encrypt } from "pigeon-protocol";

const message = "End Of The World Sun";
const sender = "they extra sock cost debris swim release supply illegal crush awful project exact genuine rather";
const recipient = "0xe486c26c2456197fb1976308d2d967ff85f3dba4e117b26f9d3d5071e588d847";
const encrypted = encrypt(message, sender, recipient);
console.log(encrypted);

```

*Returns Encryption String:*
```txt
ZjJlNTFkYTc3ODA5MTFiMDU5ZDg5YTQ1MDgzYzNkZDVmNmM5YWYxOGMxMjcyNGQ1Zjc6OTBmMWE0NTYxYmVjY2ZhNDQyZGY1MTUxZTM4ZTQ0YmQ6ZjhjM2ZhNGYxYTBkNmY5YjZhOWM5YjZiM2E1YWY3Yzc6NzVhYzEyZTQ3ZGU5MTI5YTFjZjA4Nzc5ZjE0YWRhNGI1NjQzMDQyYTljOTE3ZTQ5NTZhYWZmOWQxZTdmNzIxZmY2YTRhMzM3YjBkZWYxNmZjMjliYmVkOWZiNGRkNzkxMGMyMGJlZmYwYzg0YzhjNmQ5MWE1ODY5Njg3OGJiNzc6ZDgyYjBmYjRkMzY1MTk0MDI1ODRkZGNhMGYwZDEyZmM6YmEyNzk5MTEzMTk4MTUzOTIxNjA4MmRjMWJlY2U1OTg=
```

*Example use, decrypting an encrypted message:*
```js
import { decrypt } from "pigeon-protocol";

const encrypted = "ENCRYPTED_MESSAGE";
const sender = "0x852e51d4f7782b3a976e1e3707fd803d8f9d8f35e5a405a086d96b95a00ded47";
const recipient = "upgrade misery bracket beyond unfold vault peanut dance person repair balcony glad gaze coin ceiling";
const decrypted = decrypt(encrypted, sender, recipient);
console.log(decrypted);

// Returns Decrypted String:
// End Of The World Sun

```



# The Protocol

## Key Derivation
The basis of key derivation is on the use of mnemonic phrases for generating deterministic key pairs. Under this method of key derivation, 15-word mnemonic phrases are obtained based on [BIP39 using the English wordlist](https://www.npmjs.com/package/@iacobus/bip39) with an initial entropy length of 160 bits.

To derive the private key from the mnemonic phrase, the **PBKDF2** ([Password-Based Key Derivation Function 2](https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest)) synchronous key derivation function is used, supplying the mnemonic phrase (in UTF-8 NFKD) as the password, and a SHA256 hash of the password as a salt. The iterations count is set to 210000 based on the  [OWASP recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2) for **PBKDF2-HMAC-SHA512**. The length of the derived private key is 64 bytes, and HMAC-SHA512 is used as the pseudo-random function. This method of private key derivation is based in part on BIP39 *[From mnemonic to seed](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#from-mnemonic-to-seed)*.

A **Curve25519** public key is derived from the 64 byte private key based on the first 32 bytes taken as a private scalar based on [X25519](https://www.npmjs.com/package/@noble/curves#ed25519-x25519-ristretto255). The resulting public key is returned in hexadecimal with `0x` prefixed.

## Encryption & Decryption
A X25519 shared secret is derived from private scalar and a public key. This shared secret is then used to derive a symmetric key based on the synchronous [HKDF key derivation function](https://nodejs.org/api/crypto.html#cryptohkdfsyncdigest-ikm-salt-info-keylen), with a SHA256 digest, and salt of 16 random bytes, for a key length of 32 bytes.

During encryption the **aes-256-gcm** algorithm is used with Node.js Crypto's [createCipheriv](https://nodejs.org/api/crypto.html#cryptocreatecipherivalgorithm-key-iv-options), with the symmetric key provided as the encryption key, and an initialization vector of 16 random bytes to create a cypher. This cypher is then used to obtain cyphertext and an authentication tag, with the cyphertext being the encryption of a provided input string (e.g.. a message). Before transport, the symmetric key is also encrypted, in a process mirroring the input string encryption, encrypting the symmetric key using a shared secret as the encryption key.

For decryption, the aes-256-gcm algorithm is used again, this time with Node.js Crypto's [createDecipher](https://nodejs.org/api/crypto.html#cryptocreatedecipherivalgorithm-key-iv-options), with the symmetric key provided as the decryption key, and the initialization vector from encryption to create a decypher. From this decypher, the authentication tag is set, and the cyphertext decrypted to return the original input string. This process is mirrored for symmetric key decryption, with the symmetric key decrypted by the shared secret.

## Transport
For transport, the cyphertext, encrypted symmetric key, and the associated authentication tags and initialization vectors of each need to be communicated. To accomplish this, all items are joined by `:` into a single string with base64 encoding. This base64 string is used for transport, and is provided alongside a private key and public key for decryption (e.g.. the public key of the sender and the private key of the recipient).
