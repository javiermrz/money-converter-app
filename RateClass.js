var rp = require("request-promise");

class Rate {
  constructor() {
      this.date = 'latest';
      this.finalCurrency = "";
  }
  executeCommand() {
    rp(
      `http://data.fixer.io/api/${this.date}?access_key=709c5c2d792f8faea5663f475fc8de1e`
    )
      .then(content => {
        this.currenciesList = JSON.parse(content);
      })
      .then(() => {
        this.printRate();
      }).catch(function(err) {
        console.log(err);
      });
  }
  printRate(){
    console.log(
        `Rate of ${this.finalCurrency} is ${this.currenciesList.rates[this.finalCurrency]}`
      );
  }
}

let rate = new Rate();
module.exports = rate;