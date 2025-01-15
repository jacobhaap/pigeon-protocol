# Pigeon Protocol

> Pigeon Protocol for end-to-end encryption.

The **Pigeon Protocol** is an end-to-end encryption protocol that combines Elliptic-curve Diffie–Hellman (ECDH) key exchange and symmetric key encryption, utilizing Curve25519, AES-256-GCM, and HKDF-SHA256 as cryptographic primitives.

*To get started, install the library:*
```bash
npm install pigeon-protocol
```
## Usage
### Identity
A new identity can be created or an existing identity regenerated with the `new` or `regenerate` methods of `identity`, and are both asynchronous. An identity consists of a mnemonic phrase, and public & private key pair. When using the `.regenerate` method, a mnemonic phrase is provided to reobtain the associated key pair. The mnemonic phrase can be used in place of the private key for encryption and decryption.
```js
const { identity } =  require('pigeon-protocol');

// Create a new identity
identity.new();

// Regenerate an identity from a mnemonic phrase
identity.regenerate(mnemonic);
```

### Encryption & Decryption
Encryption and decryption are based on the `encrypt` and `decrypt` functions, both asynchronous. These functions are based on the expectation of a sender to single recipient, both requiring a private key and a public key. The `encrypt` function, expects that an *input* be provided (the input to encrypt) along with a *private key* (the sender) and a *public key* (the recipient), and returns an encryption prepared for transport as a string. The `decrypt` function, expects that an *encrypted input* be provided, along with a *private key* (the recipient) and a *public key* (the sender). The sender can also decrypt their own encryption based on their private key and the public key of the recipient.
```js
const { encrypt, decrypt } =  require('pigeon-protocol');

// For encryption
encrypt(input, privateKey, publicKey)

// For decryption
decrypt(encryptedInput, publicKey, privateKey);
```

## The Protocol

### Key Derivation
The basis of key derivation is on the use of mnemonic phrases for generating deterministic key pairs. Under this method of key derivation, 15-word mnemonic phrases are obtained based on [BIP39 using the English wordlist](https://www.npmjs.com/package/@iacobus/bip39) with an initial entropy length of 160 bits. Entropy is generated internally with the `.randomBytes()` method of [Node.js Crypto](https://nodejs.org/api/crypto.html#crypto).

To derive the private key from the mnemonic phrase, the **PBKDF2** ([Password-Based Key Derivation Function 2](https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest)) synchronous key derivation function is used, supplying the mnemonic phrase (in UTF-8 NFKD) as the password, and a SHA256 hash of the password as a salt. The iterations count is set to 210000 based on the  [OWASP recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2) for **PBKDF2-HMAC-SHA512**. The length of the derived private key is 64 bytes, and HMAC-SHA512 is used as the pseudo-random function. This method of private key derivation is based in part on BIP39 *[From mnemonic to seed](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#from-mnemonic-to-seed)*.

A **Curve25519** public key is derived from the 64 byte private key based on the first 32 bytes taken as a private scalar based on [X25519](https://www.npmjs.com/package/@noble/curves#ed25519-x25519-ristretto255), using `x25519.getPublicKey()`. The resulting public key is returned in hexadecimal with `0x` prefixed.

### Encryption & Decryption
A Curve25519 shared secret is derived from private scalar and a public key based on X25519 using `x25519.scalarMult()`. This shared secret is then used to derive a symmetric key based on the synchronous [HKDF key derivation function](https://nodejs.org/api/crypto.html#cryptohkdfsyncdigest-ikm-salt-info-keylen), with a SHA256 digest, and salt of 16 random bytes, for a key length of 32 bytes.

Cyphertext is obtained based on a provided input and a symmetric key as the cryptographic key. The **aes-256-gcm** algorithm is used with Crypto's [createCipheriv method](https://nodejs.org/api/crypto.html#cryptocreatecipherivalgorithm-key-iv-options), with an initialization vector of 16 random bytes to create a cypher. From the cypher, the cyphertext of the input and an authentication tag are obtained. Before transport, the symmetric key is also encrypted based on this same method, providing the symmetric key as input and the shared secret as the cryptographic key.

The decryption of cyphertext is based on Crypto's [createDecipher method](https://nodejs.org/api/crypto.html#cryptocreatedecipherivalgorithm-key-iv-options). The decryption process is the inverse of the encryption process, requiring the cyphertext, symmetric key, and the cypher's initialization vector and authentication tag be used to decrypt the cyphertext.

### Transport
For transport, the cyphertext, encrypted symmetric key, and the associated authentication tags and initialization vectors of each need to be communicated. To accomplish this, all items are joined by `:` into a single string, and a buffer of this joined string is taken and encoded to base64. This base64 string is used for transport, and is provided alongside a private key and public key for decryption (e.g.. the public key of the sender and the private key of the recipient).
