async function withdrawFromBallgameAddress(secret, alice_priv, bob_priv, alice_pub, bob_pub, packers_hash, saints_hash) {
    var txid1 = "e8fe8ad0656b0006e85f79f473cd061ebd14a7230df275c171dbb64f34e87dfe"; // UTXO from Alice
    var txid2 = "948b963a26cc2691f393b6586592d18112a2b398c17aa3ce5d4b30b73f85da96"; // UTXO from Bob
    var txindex1 = 1;  // Index for Alice's UTXO
    var txindex2 = 0;  // Index for Bob's UTXO (placeholder, you should replace this with the actual index)
    var useraddress = "bcrt1qsqvgx9pc0vsm3jjr8xk2swqw5ax0jpyzglqk58";
    var original_quantity_of_sats_each = 2000000;  // Assuming both UTXOs are the same size
    var total_input = 2 * original_quantity_of_sats_each;
    var fee = 500;  // This fee might be low, consider adjusting it
    var new_quantity_of_sats = total_input - fee;

    var witnessscript = ballgameScript(alice_pub, bob_pub, packers_hash, saints_hash);

    var p2wsh = bitcoinjs.payments.p2wsh({
        redeem: {
            output: ballgameScript(
                alice_pub, bob_pub, packers_hash, saints_hash), network:
                bitcoinjs.networks.regtest
        }, network: bitcoinjs.networks.regtest
    });

    var scriptaddress = p2wsh.address;
    var outputscript = "00" + bitcoinjs.crypto.sha256(witnessscript).toString('hex');

    var psbt = new bitcoinjs.Psbt({ network: bitcoinjs.networks.regtest });

    // Add Alice's UTXO
    psbt.addInput({
        hash: txid1, index: txindex1, witnessScript: p2wsh.redeem.output,
        witnessUtxo: {
            script: buffer.Buffer.from('0020' +
                bitcoinjs.crypto.sha256(buffer.Buffer.from(witnessscript, 'hex')).toString('hex'), 'hex'), value: original_quantity_of_sats_each
        },
    });

    // Add Bob's UTXO
    psbt.addInput({
        hash: txid2, index: txindex2, witnessScript: p2wsh.redeem.output,
        witnessUtxo: {
            script: buffer.Buffer.from('0020' +
                bitcoinjs.crypto.sha256(buffer.Buffer.from(witnessscript, 'hex')).toString('hex'), 'hex'), value: original_quantity_of_sats_each
        },
    });

    // Sign Alice's UTXO
    psbt.signInput(0, bitcoinjs.ECPair.fromPrivateKey(buffer.Buffer.from(alice_priv, "hex")));

    // Sign Bob's UTXO
    psbt.signInput(1, bitcoinjs.ECPair.fromPrivateKey(buffer.Buffer.from(bob_priv, "hex")));

    // Add the combined output
    psbt.addOutput({
        address: useraddress,
        value: new_quantity_of_sats,
    });

    var getFinalScripts = (input, script) => {
        var stack_elements = [
            input.partialSig[0].signature,  // Alice's signature
            input.partialSig[1].signature,  // Bob's signature
            buffer.Buffer.from(secret, "hex"),
            bitcoinjs.opcodes.OP_1
        ];

        var witnessStack = bitcoinjs.payments.p2wsh({ redeem: { output: script, input: bitcoinjs.script.compile(stack_elements) } });

        return { finalScriptWitness: witnessStackToScriptWitness(witnessStack.witness) }
    }

    psbt.finalizeInput(0, getFinalScripts);

    setTimeout(function () { console.log(psbt.extractTransaction().toHex()); }, 1000);
}