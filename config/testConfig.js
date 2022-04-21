
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    // @dev todo- to use test addresses, ensure they match with ganache addresses
    let testAddresses = [
        "0xEEe5576e39fb64aBAA0DDa12E14D52a2ae09Dc75",
        "0xa469Fe8d0f4483889970738B4eD8280F755cA511",
        "0x7f6883f08D4d44d9Fad97F770BD1Bc8A6F075C52",
        "0xA950b4C0b999A312163362aC7A9C3C936B0392A2",
        "0x6B87c8B7B1a12CFAA51DFc474C0426D62A5EA5d0",
        "0x049767365aB375F0796003101aF5D1f6caf2Bd7D",
        "0x6567a5b5264582e549A787adBE52953D0E4936ac",
        "0xD8A3da1Ff4216167dD1C5325398069eF610a7AE3",
        "0xb3C8f12E1e97534387Cd2e58097a618eBd5A2131"
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