#!/usr/bin/env node

const fs = require("fs");
var rp = require("request-promise");
var rate = require("./RateClass.js");
var convert = require("./ConvertClass.js");
var historical = require("./HistoricalClass.js");

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

// var convert = require("./ConvertClass.js");
// var inter = require("./InterClass.js");

var command = process.argv[2];
var actualCurrency = argv.from;
var finalCurrency = argv.to;

switch (command) {
  case "rate":
    rate.finalCurrency = argv.to;
    rate.executeCommand();
    break;
  case "convert":
    convert.finalCurrency = argv.to;
    convert.executeCommand();
    break;
  case "inter":
    var inter = require("./InterClass.js");
    inter.actualCurrency = argv.from;
    inter.finalCurrency = argv.to;
    inter.executeCommand();
    break;
  case "historical":
    historical.actualCurrency = argv.from;
    historical.date = argv.date;
    historical.executeCommand();
    break;
  default:
    handleInvalidCommand();
}
