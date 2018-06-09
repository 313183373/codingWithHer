const ERROR_CANCEL_INVALID = 'Error: the cancel is invalid';
const ERROR_BOOKING_CONFLICT = 'Error: the booking conflicts with existing bookings';
const ERROR_CANCEL = 'Error: the booking being cancelled does not exist!';
const SUCCESS_BOOKING = 'Success: the booking is accepted!';
const SUCCESS_CANCEL = 'Success: the booking is cancelled!';

const User = require('./User');
const MoneyManager = require('./MoneyManager');

class BadmintonManager {
    constructor(openTime, closeTime) {
        BadmintonManager.schedule = {};
        BadmintonManager.openTime = openTime;
        BadmintonManager.closeTime = closeTime;
        BadmintonManager.userList = {};
        BadmintonManager.records = {A: [], B: [], C: [], D: []};
    }

    book(bookInfo) {
        BadmintonManager.schedule[bookInfo.date] = BadmintonManager.schedule[bookInfo.date]
            || {};
        BadmintonManager.schedule[bookInfo.date][bookInfo.courtId]
            = BadmintonManager.schedule[bookInfo.date][bookInfo.courtId]
            || new Array(24).fill('0');

        if (!this.isValidPeriod(bookInfo.start, bookInfo.end)
            || this.isConflict(bookInfo.date, bookInfo.start, bookInfo.end, bookInfo.courtId)) {
            throw new Error(ERROR_BOOKING_CONFLICT);
        }

        // user添加booking
        let user = undefined;

        if (BadmintonManager.userList[bookInfo.uid]) {
            user = BadmintonManager.userList[bookInfo.uid];
        } else {
            user = new User(bookInfo.uid);
            BadmintonManager.userList[bookInfo.uid] = user;
        }

        user.addBooking(bookInfo);

        // schedule添加booking
        BadmintonManager.schedule[bookInfo.date][bookInfo.courtId]
            .fill('1', bookInfo.start.substr(0, 2), bookInfo.end.substr(0, 2));

        // records添加booking
        BadmintonManager.records[bookInfo.courtId].push({
            info: bookInfo,
            money: MoneyManager.calBook(bookInfo.weekday, bookInfo.start, bookInfo.end)
        });
        return SUCCESS_BOOKING;
    }


    cancel(bookInfo) {
        if (bookInfo.purpose !== 'C') {
            throw new Error(ERROR_CANCEL_INVALID);
        }

        if (!BadmintonManager.userList[bookInfo.uid]) {
            throw new Error(ERROR_CANCEL);
        }

        let user = BadmintonManager.userList[bookInfo.uid];
        const bookIndex = user.isBooking(bookInfo);
        if (bookIndex === -1) {
            throw new Error(ERROR_CANCEL);
        }
        // 删除用户的预定信息
        user.bookings.splice(bookIndex, 1);
        // 删除schedule
        BadmintonManager.schedule[bookInfo.date][bookInfo.courtId]
            .fill('0', bookInfo.start.substr(0, 2), bookInfo.end.substr(0, 2));
        // records添加cancel
        BadmintonManager.records[bookInfo.courtId].push({
            info: bookInfo,
            money: MoneyManager.calCancel(bookInfo.weekday, bookInfo.start, bookInfo.end)
        });
        return SUCCESS_CANCEL;
    }

    isValidPeriod(start, end) {
        // 整点问题
        if (!start.match(/^(\d\d):00/) || !end.match(/^(\d\d):00/)) {
            return false;
        }
        // 营业时间
        if (parseInt(start.substr(0, 2)) < BadmintonManager.openTime
            || parseInt(end.substr(0, 2)) > BadmintonManager.closeTime) {
            return false;
        }
        return true;
    }

    isConflict(date, start, end, courtId) {
        return !BadmintonManager.schedule[date][courtId]
            .slice(start.substr(0, 2), end.substr(0, 2)).every(value => value === '0');
    }
}

module.exports = BadmintonManager;