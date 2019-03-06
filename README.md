# Money Converter App
### What is it?
A console app with several functionalities. As the name indicates, you will be able to get
different **currencies rates** and **conversions** in **real time** (information is retrieved from an 
API).

### How do you use it?
The first thing you should do is type the following in your console:
```
node money-converter.js --help 
```
You will then be able to read all the necessary information to manage the app.
However, keep reading to know exactly how each of the commands works!

* ### Rate
This command is very symple. All you have to do is type the following:
```
node money-converter.js rate --to CURRENCIE
``` 
being **CURRENCIE** an existing currencie such as *AUD* or *USD*. 
This will return the rate of the introduced currency.

* ### Convert
This command will make a money conversion from certain amount of money to the introduced currency.
All you have to do is type: 
```
node money-converter.js convert --to CURRENCIE
``` 
It will ask you for the amount of **Euros** that you have, and make the conversion afterwards.

