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

let arrayOfTransactions = [];
let arrayOfNames = [];

function createArrayOfNames () {
    for (let i = 1; i < arrayOfTransactions.length; i++) {
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

makeAccount(lines, arrayOfTransactions);

arrayOfNames = createArrayOfNames();

console.log(arrayOfNames);



// get a name
// find all transactions from this name
// sum the total amount of money
// find all transactions to this name
// sum them up
// deduct 'to' from 'from'
// 

let userCommand = readlineSync.question('Type the command ');
if (userCommand === 'List All') {


}

