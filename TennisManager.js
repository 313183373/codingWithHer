const BOOKING_INVALID = 'the booking is invalid';
class TennisManager {
    constructor(number) {
    }

    decodeInput(input) {
        let inputArray = input.split(' ');
        let [uid, date, period, courtId, purpose] = inputArray;
        if(!purpose) {
            // booking
            if(inputArray.length !== 4) {
                throw new Error(BOOKING_INVALID);
            }
            purpose = 'B';
        } else {
            if(inputArray.length !== 5 || purpose !== 'C') {
                throw new Error(BOOKING_INVALID);
            }
        }
        const [start, end] = period.split('~');
        const weekday = new Date(date).getDay();
        if(isNaN(weekday)) {
            throw new Error(BOOKING_INVALID);
        }
        if(start === undefined || end === undefined) {
            throw new Error(BOOKING_INVALID);
        }
        if(!start.match(/^(\d\d):00/) || !end.match(/^(\d\d):00/)) {
            throw new Error(BOOKING_INVALID);
        }
        if(!'ABCD'.includes(courtId)) {
            throw new Error(BOOKING_INVALID);
        }
        return {
            uid,date,weekday,start,end,courtId,purpose
        }
    }
}

module.exports = TennisManager;