var rp = require("request-promise");

class Historical {
  constructor() {
    this.actualCurrency = "";
    this.date = "latest";
    this.moneyUnits = 0;
  }
  executeCommand() {
    if (this.date == undefined) {
      this.handleInvalidDate();
      return;
    }
    rp(
      `http://data.fixer.io/api/latest?access_key=709c5c2d792f8faea5663f475fc8de1e`
    )
      .then(content => {
        this.actualCurrenciesList = JSON.parse(content);
        const rateNotSupported =
          this.actualCurrenciesList.rates[this.actualCurrency] == undefined;
        if (rateNotSupported) {
          throw this.handleRateNotSupported;
        }
      })
      .then(() => {
        return rp(
          `http://data.fixer.io/api/${
            this.date
          }?access_key=709c5c2d792f8faea5663f475fc8de1e`
        );
      })
      .then(content => {
        this.pastCurrenciesList = JSON.parse(content);
        if (this.pastCurrenciesList.rates == undefined) {
          throw this.handleInvalidDatedReception;
        }
        return this.getMoneyQuantity();
      })
      .then(() => {
        this.compareMoneyValueByDate();
      })
      .catch(handleError => {
        handleError();
      });
  }
  async getMoneyQuantity() {
    console.log(`How much ${this.actualCurrency} do you have?`);
    this.moneyUnits = await this.getInputData();
  }
  async returnPromis() {}

  getInputData() {
    return new Promise((resolve, reject) => {
      var stdin = process.openStdin();
      stdin.addListener("data", d => {
        process.stdin.destroy();
        resolve(parseInt(d.toString().trim()));
      });
    });
  }
  compareMoneyValueByDate() {
    //console.log(pastCurrenciesList);
    var difference =
      this.moneyUnits *
      (this.actualCurrenciesList.rates[this.actualCurrency] -
        this.pastCurrenciesList.rates[this.actualCurrency]);
    console.log(
      "The difference in value of your money at the time introduced compared to the actuall value is " +
        difference
    );
  }
  handleInvalidDate() {
    console.log("A valid date was not introduced");
  }
  handleRateNotSupported() {
    console.log(`Sorry, we don't support the introduced currency.`);
  }
  handleInvalidDatedReception() {
    console.log("An error occured. Introduced date may not be valid");
  }
}

module.exports = new Historical();
