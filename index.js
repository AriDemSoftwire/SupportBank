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

}

let arrayOfTransactions = [];
let arrayOfNames = [];
let arrayOfAccounts = [];
let arrayOfImportedData = [];

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
      //     throw `Invalid value at line ${i}`;
        }
        if (parseFloat(line[4]) !== parseFloat(line[4])) {
            logger.debug(`Error: ${line[4]} is not a number. Array index is ${i}`);
      //     throw `Invalid value at line ${i}`;
        }
    }
    return newArray;
}

function makeArrayOfNames() {
    for (let i = 1; i < arrayOfTransactions.length; i++) {
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

arrayOfTransactions = makeArrayOfTransactions(arrayOfImportedData);
arrayOfNames = makeArrayOfNames();
arrayOfAccounts = makeArrayOfAccounts();

readlineSync.promptCLLoop({
Import: function importFile (fileName) {
    let importedFileParsed;
    let importedFile = fs.readFileSync(`${fileName}`, "utf-8");
    if (fileName.includes('.csv')) {
        importedFileParsed = importedFile.split("\n");
        importedFileParsed.shift();
        console.log(fileName + ' is imported.')
        return importedFile;
    } 
    else
    if (fileName.includes('.json')) {
        importedFileParsed = JSON.parse(importedFile);
        console.log(fileName + ' is imported.')
        return importedFile;
    }
    else {
        console.log(fileName + ' is of invalid format.')
        logger.debug(`Error: ${fileName} is of invalid format`);
        return;
    }
    
},
List: function listTransactions (name) {
    for (let i = 0; i < arrayOfAccounts.length; i++) {
        (name === arrayOfAccounts[i].name)
        for (let i = 0; i < arrayOfAccounts[i].transactionsFrom.length; i++) {
            console.log(arrayOfAccounts[i].transactionsFrom);
        }
        for (let i = 0; i < arrayOfAccounts[i].transactionsTo.length; i++) {
            console.log(arrayOfAccounts[i].transactionsTo);
    }
}
},
ListAll: function listAllAccounts () {
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
},
Close: function() { return true; }
})

/* const userCommand = readlineSync.question("Type the command ");

if (userCommand === 'Import File ') {
    arrayOfImportedData = importFile();
}
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
} */
