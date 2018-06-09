const BOOKING_INVALID = 'the booking is invalid';
const BOOKING_CONFLICT = 'the booking conflicts with existing bookings';
const CANCEL_ERROR = 'Error: the booking being cancelled does not exist!';

const User = require('./User');

class TennisManager {
    constructor(openTime, closeTime) {
        TennisManager.schedule = {};
        TennisManager.openTime = openTime;
        TennisManager.closeTime = closeTime;
        TennisManager.userList = {};
    }

    decodeInput(input) {
        let inputArray = input.split(' ');
        let [uid, date, period, courtId, purpose] = inputArray;
        if (!purpose) {
            // booking
            if (inputArray.length !== 4) {
                throw new Error(BOOKING_INVALID);
            }
            purpose = 'B';
        } else {
            if (inputArray.length !== 5 || purpose !== 'C') {
                throw new Error(BOOKING_INVALID);
            }
        }
        const [start, end] = period.split('~');
        if (parseInt(start.substr(0, 2)) > parseInt(end.substr(0, 2))) {
            throw new Error(BOOKING_INVALID);
        }
        const weekday = new Date(date).getDay();
        if (isNaN(weekday)) {
            throw new Error(BOOKING_INVALID);
        }
        if (start === undefined || end === undefined) {
            throw new Error(BOOKING_INVALID);
        }

        if (!'ABCD'.includes(courtId)) {
            throw new Error(BOOKING_INVALID);
        }
        return {
            uid, date, weekday, start, end, courtId, purpose
        }
    }

    book(bookInfo) {
        TennisManager.schedule[bookInfo.date] = TennisManager.schedule[bookInfo.date]
            || {};
        TennisManager.schedule[bookInfo.date][bookInfo.courtId]
            = TennisManager.schedule[bookInfo.date][bookInfo.courtId]
            || new Array(24).fill('0');

        if (!this.isValidPeriod(bookInfo.start, bookInfo.end)
            || this.isConflict(bookInfo.date, bookInfo.start, bookInfo.end, bookInfo.courtId)) {
            throw new Error(BOOKING_CONFLICT);
        }

        let user = undefined;

        if (TennisManager.userList[bookInfo.uid]) {
            user = TennisManager.userList[bookInfo.uid];
        } else {
            user = new User(bookInfo.uid);
            TennisManager.userList[bookInfo.uid] = user;
        }

        user.addBooking(bookInfo);

        TennisManager.schedule[bookInfo.date][bookInfo.courtId]
            .fill('1', bookInfo.start.substr(0, 2), bookInfo.end.substr(0, 2));

        return 'Success: the booking is accepted!';
    }


    isValidPeriod(start, end) {
        // 整点问题
        if (!start.match(/^(\d\d):00/) || !end.match(/^(\d\d):00/)) {
            return false;
        }
        // 营业时间
        if (parseInt(start.substr(0, 2)) < TennisManager.openTime
            || parseInt(end.substr(0, 2)) > TennisManager.closeTime) {
            return false;
        }
        return true;
    }

    isConflict(date, start, end, courtId) {
        return !TennisManager.schedule[date][courtId]
            .slice(start.substr(0, 2), end.substr(0, 2)).every(value => value === '0');
    }

    cancel(bookInfo) {
        if (!TennisManager.userList[bookInfo.uid]) {
            throw new Error(CANCEL_ERROR);
        }

        let user = TennisManager.userList[bookInfo.uid];
        const bookIndex = user.isBooking(bookInfo);
        if (bookIndex === -1) {
            throw new Error(CANCEL_ERROR);
        }
        // 删除用户的预定信息
        user.bookings.splice(bookIndex, 1);
        // 删除schedule
        TennisManager.schedule[bookInfo.date][bookInfo.courtId]
            .fill('0', bookInfo.start.substr(0, 2), bookInfo.end.substr(0, 2));

        return 'Success: the booking is cancelled!';
    }
}

const testManager = new TennisManager(9, 22);

testManager.book({
    uid: 'U123',
    date: '2018-06-09',
    weekday: 6,
    start: '10:00',
    end: '22:00',
    courtId: 'A'
});


module.exports = TennisManager;