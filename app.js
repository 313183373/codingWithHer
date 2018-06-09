const BadmintonManager = require('./BadmintonManager');
const PrintManager = require('./PrintManager');

let input1 = 'U123 2016-06-02 20:00~22:00 A';
let input2 = 'U123 2016-06-03 20:00~22:00 B';
let input3 = 'U123 2016-06-02 09:00~10:00 A';
let badmintonManager = new BadmintonManager(9, 22);
badmintonManager.book(badmintonManager.decodeInput(input1));
badmintonManager.book(badmintonManager.decodeInput(input2));
badmintonManager.book(badmintonManager.decodeInput(input3));
console.log(PrintManager.print(BadmintonManager.records));