
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    // @dev todo- to use test addresses, ensure they match with ganache addresses
    let testAddresses = [
        "0x06018f434048514775421Ea53283dC67D9A40Fde",
        "0x1bCe1dDa52FC20dD355d099775Ed4AE0E901D72C",
        "0x6562CF046d7dBeA3b7c6A84257c4E5113434F78C",
        "0x67463f46F85A9d282D9b149831babfed71c946d9",
        "0x4BE6768CB1a8C3A4BDf25D10072E034C09220dB7",
        "0x49ec1a8B6A7A07001dF716c83a8B060B9454cc3a",
        "0x0b67953278c3Bff31F7C19425102331DE8019E5e",
        "0x9784ee40b55Db5F3368A457fa35632686B9f5A78",
        "0x2eAd5E57BF94D90678d3968b8FA5E43a1d53a6a1"
    ];

// set basic address variables
    let owner = accounts[0];
    let firstAirline = accounts[1];
    let firstPassenger = accounts[7];
//initialize contract instances
    let flightSuretyData = await FlightSuretyData.new();
    let flightSuretyApp = await FlightSuretyApp.new(flightSuretyData.address);

    
    return {
        owner: owner,
        firstAirline: firstAirline,
        firstPassenger: firstPassenger,
        weiMultiple: (new BigNumber(10)).pow(18),  //for unhandled ether conversions
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};