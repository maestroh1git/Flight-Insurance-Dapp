import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import express from 'express';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const config = Config['localhost'];
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));

init();

const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const oracles = [];

async function init() {
    const accounts = await web3.eth.getAccounts();

    const NUMBER_OF_ORACLES = 40;
    registerOracles(accounts.slice(1, NUMBER_OF_ORACLES + 1));

    flightSuretyApp.events.OracleRequest({fromBlock: 0}, (error, event) => {
        if (error) return console.log(error);
        if (!event.returnValues) return console.error("No returnValues");

        FlightStatusResponse(
            event.returnValues.index,
            event.returnValues.airline,
            event.returnValues.flight,
            event.returnValues.timestamp
        )
    });

}

async function registerOracles(oracleAccounts) {

    const fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
    const STATUS_CODES = [0, 10, 20, 30, 40, 50];

    for (let i = 0; i < oracleAccounts.length; i++) {

        const address = oracleAccounts[i];
        const statusCode = STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];

        await flightSuretyApp.methods.registerOracle().send({
            from: address,
            value: fee,
            gas: 3000000
        });

        const indexes = await flightSuretyApp.methods
            .getMyIndexes()
            .call({ from: address });

        oracles.push({ address, indexes, statusCode });
    }

    console.log(`${oracles.length} Oracles Registered`);
}

async function FlightStatusResponse(index, airline, flight, timestamp) {

    if (oracles.length === 0) return;

    console.log("New Oracle request ************************")
    console.log(index, airline, flight, timestamp);

    const activeOracles = [];

    oracles.forEach((oracle) => {
        if ( BigNumber(oracle.indexes[0]).isEqualTo(index) ) activeOracles.push( oracle );
        if ( BigNumber(oracle.indexes[1]).isEqualTo(index) ) activeOracles.push( oracle );
        if ( BigNumber(oracle.indexes[2]).isEqualTo(index) ) activeOracles.push( oracle );
    });

    console.log(`${activeOracles.length} Matching active Oracles will respond`);

    activeOracles.forEach( (oracle) => {
        flightSuretyApp.methods
            .submitOracleResponse(index, airline, flight, timestamp, oracle.statusCode)
            .send({ from: oracle.address, gas: 5555555 })
            .then(() => {
                console.log("Oracle responded with " + oracle.statusCode);
            })
            .catch((err) => console.log("Oracle response rejected"));
    });
}

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
});

export default app;

















// var FlightSuretyApp = require('../../build/contracts/FlightSuretyApp.json');
// var Config = require('./config.json');
// var Web3 = require('web3');
// const express = require('express');


// const {
//     web
// } = require('webpack');

// let provider;
// let web3;
// let accounts;
// let flightSuretyApp;

// async function initWeb3() {
//     let config = Config['localhost'];
//     let uri = config.url.replace('http', 'ws');
//     provider = new Web3.providers.WebsocketProvider(uri, {

//     });
//     // provider = new Web3.providers.HttpProvider(config.url);
//     web3 = new Web3(provider);
//     accounts = await web3.eth.getAccounts();
//     flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
// }

// const oracles = [];

// async function submitOracleResponse(data, account) {
//     const {
//         oracleIndex,
//         airline,
//         flight,
//         timestamp
//     } = data;

//     console.log(oracleIndex, airline, flight, timestamp);

//     const statusAvailable = [0, 10, 20, 30, 40, 50];
//     let statusCode = Math.floor(Math.random() * statusAvailable.length);

//     try {
//         await flightSuretyApp.methods.submitOracleResponse(
//             oracleIndex,
//             airline,
//             flight,
//             timestamp,
//             statusCode
//         ).send({
//             from: account
//         });
//     } catch (e) {
//         console.log(e.reason);
//     }
// }

// async function listenRequests() {
//     flightSuretyApp.events.OracleRequest({}, function (error, event) {
//         if (error) console.log(error)
//         if (event) {
//             await (new Promise(resolve => setTimeout(resolve, 1000)));
//             for (let i = 0; i < oracles.length; i++) {
//                 submitOracleResponse(event.returnValues, oracles[i]);
//             }
//         }
//     });

// }

// async function registerOracles() {
//     let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
//     console.log('Oracle registration Fee:', fee);
//     for (let i = 0; i < accounts.length; i++) {
//         if (oracles.length == 20) break;
//         try {
//             await flightSuretyApp.methods.registerOracle().send({
//                 from: accounts[i],
//                 value: fee,
//                 gas: 3000000
//             });
//             oracles.push(accounts[i]);
//             console.log(`Oracle ${i} registered.`);
//         } catch (e) {
//             // console.log(e);
//         }
//     }

//     console.log(`Registered Oracles: ${oracles.length}`);
// }

// async function init() {
//     try {
//         await initWeb3();
//         await registerOracles();
//         listenRequests();
//     } catch (e) {
//         console.log(e);
//         provider.disconnect();
//     }
// }

// init();

// const app = express();
// app.get('/', (req, res) => {});

// app.listen(3000, () => {});












// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import Config from './config.json';
// import Web3 from 'web3';
// import express from 'express';


// let config = Config['localhost'];
// let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
// let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);


// flightSuretyApp.events.OracleRequest({
//     fromBlock: 0
//   }, function (error, event) {
//     if (error) console.log(error)
//     console.log(event)
// });

// const app = express();
// app.get('/api', (req, res) => {
//     res.send({
//       message: 'An API for use with your Dapp!'
//     })
// })

// export default app;

















// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
// import Config from './config.json';
// import Web3 from 'web3';
// import express from 'express';
// import cors from 'cors';


// let config = Config['localhost'];
// let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
// let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
// let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

// let oracleAccounts = [];
// let oraclesIndexList = [];

// const TEST_ORACLES_COUNT = 25;

// let STATUS_CODE_UNKNOWN = 0;
// let STATUS_CODE_ON_TIME = 10;
// let STATUS_CODE_LATE_AIRLINE = 20;
// let STATUS_CODE_LATE_WEATHER = 30;
// let STATUS_CODE_LATE_TECHNICAL = 40;
// let STATUS_CODE_LATE_OTHER = 50;

// let defaultStatus = STATUS_CODE_ON_TIME;

// const app = express();
// app.use(cors());

// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })

// app.get('/api', (req, res) => {
//   res.send({
//     message: 'An API for use with your Dapp!'
//   })
// })

// app.get('/api/status/:status', (req, res) => {
//   var status = req.params.status;
//   var message = 'Status changed to: ';
//   switch(status) {
//     case '10':
//       defaultStatus = STATUS_CODE_ON_TIME;
//       message = message.concat("ON TIME");
//       break;
//     case '20':
//       defaultStatus = STATUS_CODE_LATE_AIRLINE;
//       message = message.concat("LATE AIRLINE");
//       break;
//     case '30':
//       defaultStatus = STATUS_CODE_LATE_WEATHER;
//       message = message.concat("LATE WEATHER");
//       break;
//     case '40':
//       defaultStatus = STATUS_CODE_LATE_TECHNICAL;
//       message = message.concat("LATE TECHNICAL");
//       break;
//     case '50':
//       defaultStatus = STATUS_CODE_LATE_OTHER;
//       message = message.concat("LATE OTHER");
//       break;
//     default:
//       defaultStatus = STATUS_CODE_UNKNOWN;
//       message = message.concat("UNKNOWN");
//       break;
//   }
//   res.send({
//     message: message
//   })
// })


// flightSuretyApp.events.OracleRequest({
//     fromBlock: "latest"
//   }, function (error, event) {
//     if (error){
//       console.log(error);
//     } 
//     console.log(event);
//     let index = event.returnValues.index;
//     console.log(`Triggered index: ${index}`);
//     let idx = 0;
//     oraclesIndexList.forEach((indexes) => {
//       let oracle = oracleAccounts[idx];
//       if(indexes[0] == index || indexes[1] == index || indexes[2] == index) {
//         console.log(`Oracle: ${oracle} triggered. Indexes: ${indexes}.`);
//         submitOracleResponse(oracle, index, event.returnValues.airline, event.returnValues.flight, event.returnValues.timestamp);
//       }
//       idx++;
//     });
// });

// flightSuretyData.events.allEvents({
//   fromBlock: "latest"
// }, function (error, event) {
//   if (error){
//     console.log("error");
//     console.log(error);
//   }  else {
//     console.log("event:");
//     console.log(event);
//   }
// });

// // flightSuretyData.events.Credited({
// //   fromBlock: "latest"
// // }, function (error, event) {
// //   if (error){
// //     console.log("error");
// //     console.log(error);
// //   }  else {
// //     console.log("Credited event:");
// //     console.log(event);
// //   }
// // });

// function submitOracleResponse (oracle, index, airline, flight, timestamp) {
//   let payload = {
//     index: index,
//     airline: airline,
//     flight: flight,
//     timestamp: timestamp,
//     statusCode: defaultStatus
//   } 
//   flightSuretyApp.methods
//   .submitOracleResponse(index, airline, flight, timestamp, defaultStatus)
//   .send({ from: oracle,
//     gas: 500000,
//     gasPrice: 20000000}, (error, result) => {
//     if(error){
//       console.log(error, payload);
//     }
//   });

//   if(defaultStatus == STATUS_CODE_LATE_AIRLINE){
//     flightSuretyData.methods.creditInsurees(flight).call({ from: oracle}, (error, result) => {
//       if(error){
//         console.log(error, payload);
//       } else {
//         console.log("Credit set for insurees");
//         // console.log(payload);
//         // console.log(result);
//       }
//     });
//   }
// }

// function getOracleAccounts() {
//   return new Promise((resolve, reject) => {
//     web3.eth.getAccounts().then(accountList => {
//       // We start at account 20 so we have first ones useable for airline and passengers.
//       oracleAccounts = accountList.slice(20, 20+TEST_ORACLES_COUNT);
//     }).catch(err => {
//       reject(err);
//     }).then(() => {
//       resolve(oracleAccounts);
//     });
//   });
// }

// function initOracles(accounts) {
//   return new Promise((resolve, reject) => {
//     flightSuretyApp.methods.REGISTRATION_FEE().call().then(fee => {
//       for(let a=0; a<TEST_ORACLES_COUNT; a++) {
//         flightSuretyApp.methods.registerOracle().send({
//           "from": accounts[a],
//           "value": fee,
//           "gas": 5000000,
//           "gasPrice": 20000000
//         }).then(() => {
//           // get indexes and save in a list
//           flightSuretyApp.methods.getMyIndexes().call({
//             "from": accounts[a]
//           }).then(result => {
//             console.log(`Oracle ${a} Registered at ${accounts[a]} with [${result}] indexes.`);
//             oraclesIndexList.push(result);
//           }).catch(err => {
//             reject(err);
//           });
//         }).catch(err => {
//           reject(err);
//         });
//       };
//       resolve(oraclesIndexList);
//     }).catch(err => {
//       reject(err);
//     });
//   });
// }

// getOracleAccounts().then(accounts => {
//   initOracles(accounts)
//   .catch(err => {
//     console.log(err.message);
//   });
// });

// export default app;


// import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
// import Config from './config.json';
// import Web3 from 'web3';
// import express from 'express';


// let config = Config['localhost'];
// let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
// let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);


// flightSuretyApp.events.OracleRequest({
//     fromBlock: 0
//   }, function (error, event) {
//     if (error) console.log(error)
//     console.log(event)
// });

// const app = express();
// app.get('/api', (req, res) => {
//     res.send({
//       message: 'An API for use with your Dapp!'
//     })
// })

// export default app;



