import log4js from "log4js";
import fs from 'fs';
import readlineSync from 'readline-Sync';

const logger = log4js.getLogger('debug');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

logger.debug("log4js test");

const lines = fs.readFileSync('Transactions2014.csv', 'utf-8').split('\n');
let lines2 = fs.readFileSync('DodgyTransactions2015.csv', 'utf-8').split('\n');
let lines3 = lines.concat(lines2);

class Transaction {
    constructor (date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }
}

class Account {

    constructor (name, transactions) {
        this.name = name;
        this.transactionsTo = this.addTransactionsTo(transactions);
        this.transactionsFrom = this.addTransactionsFrom(transactions);
    }

addTransactionsTo (transactions) {
    const transactionsTo = transactions.filter(array => array.to === this.name)
    return transactionsTo;
}

addTransactionsFrom (transactions) {
    const transactionsFrom = transactions.filter(array => array.from === this.name)
    return transactionsFrom;
}

calculateOwedSum () {
    let totalFromSum = 0;
    let totalToSum = 0;
    let totalSum = 0;
    for (let i = 0; i < this.transactionsFrom.length; i++) {
        const addFrom = parseInt(this.transactionsFrom[i].amount);
        totalFromSum += addFrom;
    }
    for (let i = 0; i < this.transactionsTo.length; i++) {
        const addTo = parseInt(this.transactionsTo[i].amount);
        totalToSum += addTo;
    }
    totalSum = totalToSum - totalFromSum;
    return totalSum;
}

listAllTransactions () {
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

function makeArrayOfTransactions (array) {
    let newArray = [];
    for (let i = 1; i < array.length; i++) {
        const line = array[i].split(',');
        newArray[i] = new Transaction(line[0], line[1], line[2], line[3], line[4]);
    }
    return newArray;
}

function makeArrayOfNames () {
    for (let i = 1; i < arrayOfTransactions.length - 1; i++) {
        if (arrayOfNames.includes(arrayOfTransactions[i].to) === false) {
            arrayOfNames.push(arrayOfTransactions[i].to);
        }
    }
    return arrayOfNames;
}

function makeArrayOfAccounts () {
    let returnArray = [];
    for (let i = 0; i < arrayOfNames.length; i++) {
        returnArray[i] = new Account(arrayOfNames[i], arrayOfTransactions);
    }
    return returnArray;
}

arrayOfTransactions = makeArrayOfTransactions(lines3);

arrayOfNames = makeArrayOfNames();

arrayOfAccounts = makeArrayOfAccounts();


const userCommand = readlineSync.question('Type the command ');
if (userCommand === 'List All') {
    for (let i = 0; i < arrayOfNames.length; i++) {
        const sum = arrayOfAccounts[i].calculateOwedSum();
        console.log('Number: ', i, '     Name: ', arrayOfAccounts[i].name, '        Sum Owed: ', sum);
    }
}

for (let i = 0; i < arrayOfNames.length; i++) {
    if (userCommand === `List ${arrayOfNames[i]}`) {
        arrayOfAccounts[i].listAllTransactions();
    }
}  
