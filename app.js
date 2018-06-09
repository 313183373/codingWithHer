const BadmintonManager = require('./BadmintonManager');
const PrintManager = require('./PrintManager');
const readlineSync = require('readline-sync');

let badmintonManager = new BadmintonManager(9, 22);
while (1) {
    const menu = ['场地预定', '取消场地预定', '打印收入'];
    switch (readlineSync.keyInSelect(menu, '请输入序号:')) {
        case 0 : {
            const userInput = readlineSync.question('请输入预定信息:');
            try {
                const result = badmintonManager.book(badmintonManager.decodeInput(userInput));
                console.log(result);
            } catch (e) {
                console.error(e.name + ' : ' + e.message);
            }
            break;
        }
        case 1 : {
            const userInput = readlineSync.question('请输入取消预订信息:');
            try {
                const result = badmintonManager.cancel(badmintonManager.decodeInput(userInput));
                console.log(result);
            } catch (e) {
                console.error(e.name + ' : ' + e.message);
            }
            break;
        }
        case 2 : {
            console.log(PrintManager.print(BadmintonManager.records));
            break;
        }
        default :
            process.exit(0);
    }
}

// let input1 = 'U123 2016-06-02 20:00~22:00 A';
// let input2 = 'U123 2016-06-03 20:00~22:00 B';
// let input3 = 'U123 2016-06-02 09:00~10:00 A';
// let badmintonManager = new BadmintonManager(9, 22);
// badmintonManager.book(badmintonManager.decodeInput(input1));
// badmintonManager.book(badmintonManager.decodeInput(input2));
// badmintonManager.book(badmintonManager.decodeInput(input3));
// console.log(PrintManager.print(BadmintonManager.records));