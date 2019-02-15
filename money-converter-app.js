#!/usr/bin/env node

const fs = require("fs");

var argv = require("yargs")
  .usage("$0 <cmd> [args]")
  .command("rate", "Gets money exchange rate")
  .command("convert", "Converts from EURO to other currency")
  .command("inter", "Converts from any currency to another one")
  .command(
    "historical",
    "Compares the value of your money at some point in the past to its actual value"
  )
  .example("$0 rate --to AUD")
  .example("$0 convert --to AUD")
  .example("$0 inter --from USD --to AUD")
  .example("$0 historical --from USD --date YYYY-MM-DD")
  .help("h")
  .alias("h", "help").argv;

var command = process.argv[2];
var rp = require("request-promise");
var actualCurrency = argv.from;
var finalCurrency = argv.to;

switch (command) {
  case "rate":
    executeRateCommand();
    break;
  case "convert":
    executeConvertCommand();
    break;
  case "inter":
    executeInterCommand();
    break;
  case "historical":
    executeHistoricalCommand();
    break;
  default:
    handleInvalidCommand();
}

////////////////////////////////////////////////////
// COMMANDS
///////////////////////////////////////////////////

///// RATE
function executeRateCommand() {
  var currenciesList;
  callRatesAPI().then(currenciesList => {
    printRate(currenciesList);
  });
}

///// CONVERT
function executeConvertCommand() {
  var currenciesList;
  //var finalCurrency: global variable (Line 28)
  callRatesAPI()
    .then(theCurrenciesList => {
      currenciesList = theCurrenciesList;
      const rateNotSupported = currenciesList.rates[finalCurrency] == undefined;
      if (rateNotSupported) {
        throw handleRateNotSupported;
      }
      return getMoneyQuantity();
    })
    .then(moneyInEuros => {
      printMoneyQuantity(currenciesList, moneyInEuros);
    })
    .catch(handleError => {
      handleError();
    });
}

///// INTER
function executeInterCommand() {
  var currenciesList;
  //var actualCurrency, finalCurrency: global variables (Lines 27 & 28)
  callRatesAPI()
    .then(theCurrenciesList => {
      currenciesList = theCurrenciesList;
      if (rateNotSupported(currenciesList)) {
        throw handleRateNotSupported;
      }
      return getMoneyQuantity();
    })
    .then(moneyUnits => {
      printMoneyQuantity(currenciesList, moneyUnits, actualCurrency);
    })
    .catch(handleError => {
      handleError();
    });
}

///// HISTORICAL
function executeHistoricalCommand() {
  var actualCurrenciesList;
  var pastCurrenciesList;
  var date = argv.date;
  if (date == undefined) {
    handleInvalidDate();
    return;
  }
  callRatesAPI()
    .then(theActualCurrenciesList => {
      actualCurrenciesList = theActualCurrenciesList;
      const rateNotSupported =
        actualCurrenciesList.rates[actualCurrency] == undefined;
      if (rateNotSupported) {
        throw handleRateNotSupported;
      }
    })
    .then(() => {
      callRatesAPI(date)
        .then(thePastCurrenciesList => {
          if (thePastCurrenciesList.rates == undefined) {
            throw handleInvalidDatedReception;
          }
          pastCurrenciesList = thePastCurrenciesList;
        })
        .then(() => {
          return getMoneyQuantity();
        })
        .then(moneyUnits => {
          compareMoneyValueByDate(
            moneyUnits,
            actualCurrenciesList,
            pastCurrenciesList
          );
        })
        .catch(handleError => {
          handleError();
        });
    })
    .catch(handleError => {
      handleError();
    });
}

////////////////////////////////////////////////////
// SOME FUNCTIONS
///////////////////////////////////////////////////

///// HANDLES
function handleInvalidCommand() {
  console.log(
    "A valid command was not introduced\nType --help to see the different commands"
  );
}

function handleRateNotSupported() {
  console.log(`Sorry, we don't support the introduced currency.`);
}

function handleInvalidDate() {
  console.log("A valid date was not introduced");
}

function handleInvalidDatedReception() {
  console.log("An error occured. Introduced date may not be valid");
}

///// OTHERS
function callRatesAPI(date = "latest") {
  return rp(
    `http://data.fixer.io/api/${date}?access_key=709c5c2d792f8faea5663f475fc8de1e`
  )
    .then(function(content) {
      var currenciesList = JSON.parse(content);
      return currenciesList;
    })
    .catch(function(err) {
      console.log(err);
    });
}

function printRate(currenciesList) {
  console.log(
    `Rate of ${finalCurrency} is ${currenciesList.rates[finalCurrency]}`
  );
}

function printMoneyQuantity(
  currenciesList,
  moneyUnits,
  actualCurrency = "EUR"
) {
  var euros = moneyUnits / currenciesList.rates[actualCurrency];
  var exchangedUnits = euros * currenciesList.rates[finalCurrency];
  console.log(`You will get ${exchangedUnits} ${finalCurrency}`);
}
function rateNotSupported(currenciesList) {
  const actualRateNotSupported =
    currenciesList.rates[actualCurrency] == undefined;
  const finalRateNotSupported =
    currenciesList.rates[finalCurrency] == undefined;
  if (actualRateNotSupported || finalRateNotSupported) {
    return true;
  }
  return false;
}

function compareMoneyValueByDate(
  moneyUnits,
  actualCurrenciesList,
  pastCurrenciesList
) {
  //console.log(pastCurrenciesList);
  var difference =
    moneyUnits *
    (actualCurrenciesList.rates[actualCurrency] -
      pastCurrenciesList.rates[actualCurrency]);
  console.log(
    "The difference in value of your money one week ago compared to the actuall value is " +
      difference
  );
}

function getInputData() {
  return new Promise((resolve, reject) => {
    var stdin = process.openStdin();
    stdin.addListener("data", d => {
      process.stdin.destroy();
      resolve(d.toString().trim());
    });
  });
}

function getMoneyQuantity() {
  return new Promise(async function(resolve, reject) {
    console.log("How much money do you have?");
    var moneyUnits = await getInputData();
    resolve(moneyUnits);
  });
}
