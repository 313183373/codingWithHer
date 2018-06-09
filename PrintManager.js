class PrintManager {
    static print(records) {
        let string = ['收入汇总', '---'];
        let total = 0;
        for (let key of Object.keys(records)) {
            string.push(`场地:${key}`);
            let sum = 0;
            if (records[key].length !== 0) {
                let map = new Map();
                records[key].forEach(item => {
                    const id = PrintManager.getRecordId(item.info);
                    map.get(id) ? map.set(id, `违约金 ${item.money}元`) : map.set(id, `${item.money}元`);
                });
                let array = Array.from(map).map(item => item.join(' ')).sort();
                sum = Array.from(map).map(value => parseInt(value[1].match(/(\d+)/)[1])).reduce((prev, now) => prev + now);
                
                string.push(array.join('\n'));
                total += sum;
            }
            string.push(`小计: ${sum}元\n`);
        }
        string.push('---');
        string.push(`总计: ${total}元`);
        return string.join('\n');
    }

    static getRecordId(bookInfo) {
        return `${bookInfo.date} ${bookInfo.start}~${bookInfo.end}`;
    }
}

module.exports = PrintManager;