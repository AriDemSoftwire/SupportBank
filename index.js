import fs from 'fs';
let lines = fs.readFileSync('Transactions2014.csv', 'utf-8').split('\n');

import readlineSync from 'readline-Sync';

class Transaction {
    constructor (date, from, to, narrative, amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
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

function makeAccount (array, newArray) {
    for (let i = 1; i < array.length; i++) {
        let line = array[i].split(',');
        newArray[i] = new Transaction(line[0], line[1], line[2], line[3], line[4]);
    }
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
        let from = sumTransactionFrom(arrayOfNames[i]);
        let to = sumTransactionTo(arrayOfNames[i]);
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

// loop through the transactions array and select all the transactions FROM a name
// add all those values together

// loop through the transactions array and select all the transactions TO a name
// add them together

// deduct FROM from TO
//make a new object with a name and the remaining sum

makeAccount(lines, arrayOfTransactions);

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


