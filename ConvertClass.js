var rp = require("request-promise");

class Convert {
  constructor() {
    this.date = "latest";
    this.moneyUnits = 0;
  }
  executeCommand() {
    rp(
      `http://data.fixer.io/api/${
        this.date
      }?access_key=709c5c2d792f8faea5663f475fc8de1e`
    )
      .then(content => {
        this.currenciesList = JSON.parse(content);
      })
      .then(() => {
        const rateNotSupported =
          this.currenciesList.rates[this.finalCurrency] == undefined;
        if (rateNotSupported) {
          throw handleRateNotSupported;
        }
        return this.getMoneyQuantity();
      })
      .then(() => {
        this.printMoneyQuantity();
      })
      .catch(handleError => {
        handleError();
      });
  }
  async getMoneyQuantity() {
    console.log("How much money do you have?");
    this.moneyUnits = await this.getInputData();
  }
  printMoneyQuantity() {
    var exchangedUnits =
      this.moneyUnits * this.currenciesList.rates[this.finalCurrency];
    console.log(`You will get ${exchangedUnits} ${this.finalCurrency}`);
  }
  getInputData() {
    return new Promise((resolve, reject) => {
      var stdin = process.openStdin();
      stdin.addListener("data", d => {
        process.stdin.destroy();
        resolve(parseInt(d.toString().trim()));
      });
    });
  }
}

module.exports = new Convert();
 
