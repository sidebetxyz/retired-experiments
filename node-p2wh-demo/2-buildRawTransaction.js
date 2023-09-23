const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json'));

const bitcoinjs = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair').ECPairFactory;
const tinysecp = require('tiny-secp256k1');
const { Transaction } = require('bitcoinjs-lib');

// Extracting the data
const {
    alice_private,
    bob_private,
    alice_public,
    bob_public,
    alice_hash,
    bob_hash,
    joint_address,
    witness_script,
    p2wsh_output
} = data;

// Create the ECPair instance
const ECPair = ECPairFactory(tinysecp);

// Convert the hex back to buffer
const witnessScript = Buffer.from(witness_script, 'hex');
const p2wshOutput = Buffer.from(p2wsh_output, 'hex');

const utxos = [
    { txid: 'ca90568145c4aca06d54a7e5c179262920939cb17314cdc55fd2f5cacf3b154d', vout: 1, value: 1000000, scriptPubKey: p2wshOutput.toString('hex') },
    { txid: 'da1332953307979b6a23d317d0714078ac7351c626a5d2a9fedae19b4bcba0cd', vout: 0, value: 1000000, scriptPubKey: p2wshOutput.toString('hex') }
];

const psbt = new bitcoinjs.Psbt({ network: bitcoinjs.networks.regtest });

// Adding the UTXOs as inputs to the PSBT
for (let utxo of utxos) {
    psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
            script: Buffer.from(utxo.scriptPubKey, 'hex'),
            value: utxo.value
        },
        witnessScript: witnessScript
    });
}

// Add an output for Alice's address. This is where the funds will be sent.
const totalAmount = utxos.reduce((acc, utxo) => acc + utxo.value, 0);
const fee = 1000;  // satoshis
psbt.addOutput({
    address: "bcrt1qj4ts4x59ceca8t625snzd245mwv7fvx0n484nk",
    value: totalAmount - fee
});

const alice_keys = ECPair.fromPrivateKey(Buffer.from(alice_private, 'hex'), { network: bitcoinjs.networks.regtest });
const bob_keys = ECPair.fromPrivateKey(Buffer.from(bob_private, 'hex'), { network: bitcoinjs.networks.regtest });

// Loop through all inputs and sign them with Alice's and Bob's keys
for (let i = 0; i < psbt.inputCount; i++) {
    psbt.signInput(i, alice_keys, [Transaction.SIGHASH_ALL]);
    psbt.signInput(i, bob_keys, [Transaction.SIGHASH_ALL]);
}

// Try to finalize all inputs
for (let i = 0; i < psbt.inputCount; i++) {
    try {
        psbt.finalizeInput(i);
    } catch (err) {
        console.error(`Error finalizing input #${i}:`, err.message);
    }
}

const transaction = psbt.extractTransaction();
console.log(transaction.toHex());
