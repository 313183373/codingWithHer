class User {
    constructor(uid) {
        this.uid = uid;
        this.bookings = [];
    }

    isBooking(bookInfo) {
        return this.bookings.findIndex(value => {
            return value.date === bookInfo.date && value.start === bookInfo.start
                && value.end === bookInfo.end && value.courtId === bookInfo.courtId
        });
    }

    addBooking(bookInfo) {
        this.bookings.push(bookInfo);
    }
}

module.exports = User;