class MoneyManager {
    static calBook(weekday, start, end) {
        start = parseInt(start.substr(0, 2));
        end =  parseInt(end.substr(0, 2));
        return (weekday >= 1 && weekday <= 5) ?
            MoneyManager.bookMoney.weekday.reduce((prev, now, index, arr) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0) : MoneyManager.bookMoney.weekend.reduce((prev, now, index, arr) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0);
    }

    static calCancel(weekday, start, end) {
        start = parseInt(start.substr(0, 2));
        end =  parseInt(end.substr(0, 2));
        return (weekday >= 1 && weekday <= 5) ?
            MoneyManager.cancelMoney.weekday.reduce((prev, now, index, arr) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0) : MoneyManager.cancelMoney.weekend.reduce((prev, now, index, arr) => {
                return (index < end && index >= start) ? prev + now : prev;
            }, 0);
    }
}

MoneyManager.moneyList = {};
MoneyManager.bookMoney = {
    weekday: [0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, 0],
    weekend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 40, 40, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 0]
};
MoneyManager.cancelMoney = {
    weekday: MoneyManager.bookMoney.weekday.map(elem => elem * 0.5),
    weekend: MoneyManager.bookMoney.weekend.map(elem => elem * 0.25)
};

module.exports = MoneyManager;