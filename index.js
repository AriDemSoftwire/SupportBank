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

let lines = fs.readFileSync('Transactions2014.csv', 'utf-8').split('\n');
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

    isValid () {
        this.date 
    }

}

class Account {

    transactionsTo;
    transactionsFrom;

    constructor (name) {
        this.name = name;
    }

addTransactionsTo () {

}

addTransactionsFrom () {
    
}

calculateOwedSum () {

}

listAllTransactions () {
    
}

}

class moneyToReceive {
    constructor (name, sumOwed) {
        this.name = name;
        this.sumOwed = sumOwed;
    }
}

let arrayOfTransactions = [];
let arrayOfNames = [];
let arrayListAll = [];

function createArrayOfNames () {
    for (let i = 1; i < arrayOfTransactions.length - 1; i++) {
        if (arrayOfNames.includes(arrayOfTransactions[i].to) === false) {
            arrayOfNames.push(arrayOfTransactions[i].to);
        }
    }
    return arrayOfNames;
}

function makeTransactions (array) {
    let newArray = [];
    for (let i = 1; i < array.length; i++) {
        let line = array[i].split(',');
        let entry = new Transaction(line[0], line[1], line[2], line[3], line[4]);
        if (entry.isValid) {
            newArray[i] = entry;
        }
      //  
    }
    return newArray;
}

function sumTransactionFrom (name) {
        let totalFromSum = 0;
        let transactionsFrom = arrayOfTransactions.filter(array => array.from === name)
        for (let i = 0; i < transactionsFrom.length; i++) {
            let num = parseInt(transactionsFrom[i].amount);
            totalFromSum += num;
        }
        return totalFromSum;
}

function sumTransactionTo (name) {
    let totalToSum = 0;
    let transactionsTo = arrayOfTransactions.filter(array => array.to === name)
    for (let i = 0; i < transactionsTo.length; i++) {
        let num = parseInt(transactionsTo[i].amount);
        totalToSum += num;
    }
    return totalToSum;
}

function makeArrayListAll () {
    let returnArray = [];
    for (let i = 0; i < arrayOfNames.length; i++) {
        const from = sumTransactionFrom(arrayOfNames[i]);
        const to = sumTransactionTo(arrayOfNames[i]);
        let totalSum = parseInt(to) - parseInt(from);
        returnArray[i] = new moneyToReceive(arrayOfNames[i], totalSum);
    }
    return returnArray;
}

function getAllTransactions (name) {
    let transactionsFrom = arrayOfTransactions.filter(array => array.from === name)
    let transactionsTo = arrayOfTransactions.filter(array => array.to === name)
    let finalArray = transactionsFrom.concat(transactionsTo);
    return finalArray;
}

arrayOfTransactions = makeTransactions(lines3);

arrayOfNames = createArrayOfNames();

arrayListAll = makeArrayListAll();

let userCommand = readlineSync.question('Type the command ');
if (userCommand === 'List All') {
    for (let i = 0; i < arrayOfNames.length; i++) {
        console.log('Number: ', i, '     Name: ', arrayListAll[i].name, '        Sum Owed: ', arrayListAll[i].sumOwed);
    }
}

for (let i = 0; i < arrayOfNames.length; i++) {
    if (userCommand === `List ${arrayOfNames[i]}`) {
        let listOfTransactions = getAllTransactions(arrayOfNames[i]);
        console.log(listOfTransactions);
    }
}


