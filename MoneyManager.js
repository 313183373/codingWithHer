class MoneyManager {
    static calBook(weekday, start, end) {
        return this.calculate(weekday, start, end, MoneyManager.bookMoney);
    }

    static calCancel(weekday, start, end) {
        return this.calculate(weekday, start, end, MoneyManager.cancelMoney);
    }

    static getCountingMoney(bookingDate, originMoney) {
        bookingDate = new Date(bookingDate);
        let countDates = ['2016-04-01 2016-04-02 6', '2017-08-01 2017-08-03 8'];
        for (let countDate of countDates) {
            let [start, end, count] = countDate.split(' ');

            if (bookingDate >= new Date(start) && bookingDate <= new Date(end)) {
                return 0.1 * parseInt(count) * originMoney;
            }
        }
        return 0;
    }

    static calculate(weekday, start, end, moneyObject) {
        start = parseInt(start.substr(0, 2));
        end = parseInt(end.substr(0, 2));
        return (weekday >= 1 && weekday <= 5) ?
            moneyObject.weekday.reduce((prev, now, index) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0) : moneyObject.weekend.reduce((prev, now, index) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0);
    }
}

MoneyManager.bookMoney = {
    weekday: [0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, 0],
    weekend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 40, 40, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 0]
};
MoneyManager.cancelMoney = {
    weekday: MoneyManager.bookMoney.weekday.map(elem => elem * 0.5),
    weekend: MoneyManager.bookMoney.weekend.map(elem => elem * 0.25)
};

module.exports = MoneyManager;