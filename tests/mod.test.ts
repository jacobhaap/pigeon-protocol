import { identity, type mnemonicKeyPair, encrypt, decrypt } from "../src/mod.ts";

let encryption: string;

Deno.test(`'identity' creates and regenerates mnemonic key pairs`, () => {
    const newIdent: mnemonicKeyPair = identity.new();
    const regenIdent: mnemonicKeyPair = identity.regenerate(newIdent.mnemonic);
    console.assert(typeof newIdent === 'object' &&
        typeof newIdent.mnemonic === 'string' &&
        typeof newIdent.privateKey === 'string' &&
        typeof newIdent.publicKey === 'string', `'identity.new' should create a new identity`
    );
    console.assert(typeof regenIdent === 'object' &&
        typeof regenIdent.mnemonic === 'string' &&
        typeof regenIdent.privateKey === 'string' &&
        typeof regenIdent.publicKey === 'string', `'identity.regenerate' should regenerate an existing identity`
    );
});

Deno.test(`'encrypt' produces an encryption`, () => {
    const message: string = "Congratulations Fellow Human! You just lost The Game.";
    const privateKey: string = "they extra sock cost debris swim release supply illegal crush awful project exact genuine rather";
    const publicKey: string = "0xe486c26c2456197fb1976308d2d967ff85f3dba4e117b26f9d3d5071e588d847";
    encryption = encrypt(message, privateKey, publicKey);
    console.assert(typeof encryption === 'string', `'encrypt' should produce a base64 encryption string`);
});

Deno.test(`'decrypt' decrypts an encryption string`, () => {
    const publicKey: string = "0x852e51d4f7782b3a976e1e3707fd803d8f9d8f35e5a405a086d96b95a00ded47";
    const privateKey: string = "upgrade misery bracket beyond unfold vault peanut dance person repair balcony glad gaze coin ceiling";
    const decryption: string = decrypt(encryption, publicKey, privateKey);
    console.assert(typeof decryption === 'string', `'decrypt' should decrypt a base64 encryption string`);
});
