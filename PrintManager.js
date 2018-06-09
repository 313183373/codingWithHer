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
            incomeSummary.push(`小计: ${sum}元\n`);
        }
        incomeSummary.push('---');
        incomeSummary.push(`总计: ${total}元`);
        return incomeSummary.join('\n');
    }

    static createDateAndMoneyMap(records, courtId) {
        let dateAndMoneyMap = new Map();
        records[courtId].forEach(record => {
            const id = PrintManager.getRecordId(record.info);
            dateAndMoneyMap.get(id) ?
                dateAndMoneyMap.set(id, `违约金 ${record.money}元`) :
                dateAndMoneyMap.set(id, `${record.money}元`);
        });
        return dateAndMoneyMap;
    }

    static getRecordId(bookInfo) {
        return `${bookInfo.date} ${bookInfo.start}~${bookInfo.end}`;
    }
}

module.exports = PrintManager;