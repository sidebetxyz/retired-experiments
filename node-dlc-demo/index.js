const {
    DlcOfferV0,
    ContractInfo,
    FundingInput,
    MessageType
} = require('@node-dlc/messaging');
const bitcoin = require('bitcoinjs-lib');

const network = bitcoin.networks.regtest;  // Using RegTest network