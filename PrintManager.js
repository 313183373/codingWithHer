const MoneyManager = require('./MoneyManager');

class PrintManager {
    static print(records) {
        let incomeSummary = ['收入汇总', '---'];
        let total = 0;
        for (let courtId of Object.keys(records)) {
            incomeSummary.push(`场地:${courtId}`);
            let sum = 0;
            if (records[courtId].length !== 0) {
                let dateAndMoneyMap = this.createDateAndMoneyMap(records, courtId);

                let sortedDateAndMoneyArray = Array.from(dateAndMoneyMap)
                    .map(item => item.join(' ')).sort();

                incomeSummary.push(sortedDateAndMoneyArray.join('\n'));

                sum = Array.from(dateAndMoneyMap)
                    .map(value => parseInt(value[1].match(/(\d+)/)[1]))
                    .reduce((prev, now) => prev + now);
                total += sum;
            }
            incomeSummary.push(`小计: ${sum.toFixed(2)}元\n`);
        }
        incomeSummary.push('---');
        incomeSummary.push(`总计: ${total.toFixed(2)}元`);
        return incomeSummary.join('\n');
    }

    static createDateAndMoneyMap(records, courtId) {
        let dateAndMoneyMap = new Map();
        records[courtId].forEach(record => {
            const bookingDate = PrintManager.getRecordId(record.info);
            dateAndMoneyMap.get(bookingDate) ?
                dateAndMoneyMap.set(bookingDate, `违约金 ${record.money.toFixed(2)}元`) :
                dateAndMoneyMap.set(bookingDate,
                    MoneyManager.getCountingMoney(bookingDate.split(' ')[0], record.money) === 0 ?
                        `${record.money.toFixed(2)}元` :
                        this.getCountingInfo(record.money,
                            MoneyManager.getCountingMoney(bookingDate.split(' ')[0], record.money))
                );
        });
        return dateAndMoneyMap;
    }

    static getRecordId(bookInfo) {
        return `${bookInfo.date} ${bookInfo.start}~${bookInfo.end}`;
    }

    static getCountingInfo(orginMoney, countingMoney) {
        return `${countingMoney.toFixed(2)}元 已优惠:${(orginMoney - countingMoney).toFixed(2)}元`;
    }
}

module.exports = PrintManager;