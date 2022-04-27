var HDWalletProvider = require("@truffle/hdwallet-provider");
//replace the mnemonic everytime you restart ganache!
var mnemonic = "correct kid expose wire maze save type can smart small swift roast";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 100);
      },
      network_id: '*',
      gas: 9999999
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};