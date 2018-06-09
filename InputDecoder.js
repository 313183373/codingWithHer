const BOOKING_INVALID = 'the booking is invalid';
const CANCEL_INVALID = 'the cancel is invalid';

class InputDecoder {
    static decodeInput(input) {
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
                throw new Error(CANCEL_INVALID);
            }
        }
        const [start, end] = period.split('~');
        if (parseInt(start.substr(0, 2)) > parseInt(end.substr(0, 2))) {
            if (purpose === 'B') {
                throw new Error(BOOKING_INVALID);
            } else {
                throw new Error(CANCEL_INVALID);
            }
        }
        const weekday = new Date(date).getDay();
        if (isNaN(weekday)) {
            if (purpose === 'B') {
                throw new Error(BOOKING_INVALID);
            } else {
                throw new Error(CANCEL_INVALID);
            }
        }
        if (start === undefined || end === undefined) {
            if (purpose === 'B') {
                throw new Error(BOOKING_INVALID);
            } else {
                throw new Error(CANCEL_INVALID);
            }
        }

        if (!'ABCD'.includes(courtId)) {
            if (purpose === 'B') {
                throw new Error(BOOKING_INVALID);
            } else {
                throw new Error(CANCEL_INVALID);
            }
        }
        return {
            uid, date, weekday, start, end, courtId, purpose
        }
    }
}

module.exports = InputDecoder;