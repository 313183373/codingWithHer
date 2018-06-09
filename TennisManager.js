const BOOKING_INVALID = 'the booking is invalid';
const BOOKING_CONFLICT = 'the booking conflicts with existing bookings';


class TennisManager {
    constructor(openTime, closeTime) {
        TennisManager.schedule = {};
        TennisManager.openTime = openTime;
        TennisManager.closeTime = closeTime;
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