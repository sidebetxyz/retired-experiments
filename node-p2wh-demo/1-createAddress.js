const bitcoinjs = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').ECPairFactory;
const tinysecp = require('tiny-secp256k1');

// Create the ECPair instance
const ECPair = ECPairFactory(tinysecp);

// Generate Alice and Bob's keys
const alice_keys = ECPair.makeRandom({ network: bitcoinjs.networks.regtest });
const bob_keys = ECPair.makeRandom({ network: bitcoinjs.networks.regtest });

// Print key objects
console.log("Alice Keys:", alice_keys);
console.log('Bob Keys:', bob_keys);

// Save private keys
const alice_private = alice_keys.privateKey.toString('hex');
const bob_private = bob_keys.privateKey.toString('hex');

// Print private keys
console.log('Alice Private Key:', alice_private);
console.log('Bob Private Keys', bob_private);

// Save public keys
const alice_public = alice_keys.publicKey.toString('hex');
const bob_public = bob_keys.publicKey.toString('hex');

// Print public keys
console.log('Alice Public Keys:', alice_public);
console.log('Bob Public Key', bob_public);

// Generate hashed secrets for the outcomes
const alice_hash = bitcoinjs.crypto.hash160(Buffer.from('alice_secret')).toString('hex');
const bob_hash = bitcoinjs.crypto.hash160(Buffer.from('bob_secret')).toString('hex');

// Print Alice and Bob's hash to console
console.log('Alice Hash:', alice_hash);
console.log('Bob Hash:', bob_hash);

function p2pBetScript() {
    return bitcoinjs.script.compile([
        bitcoinjs.opcodes.OP_IF,
        bitcoinjs.opcodes.OP_HASH160,
        Buffer.from(alice_hash, 'hex'),
        bitcoinjs.opcodes.OP_EQUALVERIFY,
        alice_keys.publicKey,
        bitcoinjs.opcodes.OP_CHECKSIG,
        bitcoinjs.opcodes.OP_ELSE,
        bitcoinjs.opcodes.OP_HASH160,
        Buffer.from(bob_hash, 'hex'),
        bitcoinjs.opcodes.OP_EQUALVERIFY,
        bob_keys.publicKey,
        bitcoinjs.opcodes.OP_CHECKSIG,
        bitcoinjs.opcodes.OP_ENDIF
    ]);
}

const witnessScript = p2pBetScript();
const p2wsh = bitcoinjs.payments.p2wsh({
    redeem: { output: witnessScript, network: bitcoinjs.networks.regtest },
    network: bitcoinjs.networks.regtest
});

console.log("Joint address:", p2wsh.address);

const fs = require('fs');

const dataToSave = {
    alice_private: alice_private,
    bob_private: bob_private,
    alice_public: alice_public,
    bob_public: bob_public,
    alice_hash: alice_hash,
    bob_hash: bob_hash,
    joint_address: p2wsh.address,
    witness_script: witnessScript.toString('hex'),
    p2wsh_output: p2wsh.output.toString('hex')
};

fs.writeFileSync('data.json', JSON.stringify(dataToSave));
