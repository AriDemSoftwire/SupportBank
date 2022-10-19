import log4js from "log4js";
import fs from "fs";
import readlineSync from "readline-Sync";
import moment from "moment";

const logger = log4js.getLogger("debug");

log4js.configure({
    appenders: {
        file: { type: "fileSync", filename: "logs/debug.log" },
    },
    categories: {
        default: { appenders: ["file"], level: "debug" },
    },
});

logger.debug("Programme starts");

const lines = fs.readFileSync("Transactions2014.csv", "utf-8").split("\n");
lines.pop();
let lines2 = fs.readFileSync("DodgyTransactions2015.csv", "utf-8").split("\n");
lines2.shift();
const lines3 = lines.concat(lines2);

class Transaction {
    constructor(date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

class Account {
    constructor(name, transactions) {
        this.name = name;
        this.transactionsTo = this.addTransactionsTo(transactions);
        this.transactionsFrom = this.addTransactionsFrom(transactions);
    }

    addTransactionsTo(transactions) {
        const transactionsTo = transactions.filter(
            (array) => array.to === this.name
        );
        return transactionsTo;
    }

    addTransactionsFrom(transactions) {
        const transactionsFrom = transactions.filter(
            (array) => array.from === this.name
        );
        return transactionsFrom;
    }

    calculateOwedSum() {
        let totalFromSum = 0;
        let totalToSum = 0;
        let totalSum = 0;
        for (let i = 0; i < this.transactionsFrom.length; i++) {
            const addFrom = parseFloat(this.transactionsFrom[i].amount);
            totalFromSum += addFrom;
        }
        for (let i = 0; i < this.transactionsTo.length; i++) {
            const addTo = parseFloat(this.transactionsTo[i].amount);
            totalToSum += addTo;
        }
        totalSum = totalToSum - totalFromSum;
        return Math.round(totalSum * 100) / 100;
    }

    listAllTransactions() {
        console.log(this.name);
        for (let i = 0; i < this.transactionsFrom.length; i++) {
            console.log(this.transactionsFrom[i]);
        }
        for (let i = 0; i < this.transactionsTo.length; i++) {
            console.log(this.transactionsTo[i]);
        }
    }
}

let arrayOfTransactions = [];
let arrayOfNames = [];
let arrayOfAccounts = [];

function makeArrayOfTransactions(array) {
    let newArray = [];
    for (let i = 1; i < array.length - 1; i++) {
        const line = array[i].split(",");
        newArray[i] = new Transaction(
            line[0],
            line[1],
            line[2],
            line[3],
            line[4]
        );
        if (moment(line[0], "DD/MM/YYYY", true).isValid() === false) {
           logger.debug(`Error: ${line[0]} is not a date. Array index is ${i}`);
        }
        if (parseFloat(line[4]) !== parseFloat(line[4])) {
            logger.debug(`Error: ${line[4]} is not a number. Array index is ${i}`);
        }
    }
    return newArray;
}

function makeArrayOfNames() {
    for (let i = 1; i < arrayOfTransactions.length - 2; i++) {
        if (arrayOfNames.includes(arrayOfTransactions[i].to) === false) {
            arrayOfNames.push(arrayOfTransactions[i].to);
        }
    }
    return arrayOfNames;
}

function makeArrayOfAccounts() {
    let returnArray = [];
    for (let i = 0; i < arrayOfNames.length; i++) {
        returnArray[i] = new Account(arrayOfNames[i], arrayOfTransactions);
    }
    return returnArray;
}

arrayOfTransactions = makeArrayOfTransactions(lines3);

arrayOfNames = makeArrayOfNames();

arrayOfAccounts = makeArrayOfAccounts();

const userCommand = readlineSync.question("Type the command ");
if (userCommand === "List All") {
    for (let i = 0; i < arrayOfNames.length; i++) {
        const sum = arrayOfAccounts[i].calculateOwedSum();
        console.log(
            "Number: ",
            i,
            "     Name: ",
            arrayOfAccounts[i].name,
            "        Sum Owed: ",
            sum
        );
    }
}

for (let i = 0; i < arrayOfNames.length; i++) {
    if (userCommand === `List ${arrayOfNames[i]}`) {
        arrayOfAccounts[i].listAllTransactions();
    }
}
