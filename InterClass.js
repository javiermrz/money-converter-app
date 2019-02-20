var rp = require("request-promise");

class Inter {
  constructor() {
    this.actualCurrency = "";
    this.finalCurrency = "";
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
        if (this.rateNotSupported()) {
          throw this.handleRateNotSupported;
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
  printMoneyQuantity() {
    var euros =
      this.moneyUnits / this.currenciesList.rates[this.actualCurrency];
    var exchangedUnits = euros * this.currenciesList.rates[this.finalCurrency];
    console.log(`You will get ${exchangedUnits} ${this.finalCurrency}`);
  }
  async getMoneyQuantity() {
    console.log(`How much ${this.actualCurrency} do you have?`);
    this.moneyUnits = await this.getInputData();
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
  rateNotSupported(currenciesList) {
    const actualRateNotSupported =
      this.currenciesList.rates[this.actualCurrency] == undefined;
    const finalRateNotSupported =
      this.currenciesList.rates[this.finalCurrency] == undefined;
    if (actualRateNotSupported || finalRateNotSupported) {
      return true;
    }
    return false;
  }

  handleRateNotSupported() {
    console.log(`Sorry, we don't support the introduced currency.`);
  }
}

module.exports = new Inter();
