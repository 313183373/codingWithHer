const TennisManager = require('../TennisManager');

describe("TestInput", function() {

    // booking
    it("should return error when booking input is wrong", function() {
        // given
        let input = 'abd14';
        // when
        const testManager = new TennisManager();
        const decodeResult = testManager.decodeInput(input);
        // then
        expect(decodeResult).toThrow(new Error('the booking is invalid'));
    });


    it('should return right when booking input is right', function () {
        // given
        let input = 'abd14';
        // when
        const testManager = new TennisManager();
        const decodeResult = testManager.decodeInput(input);
        // then
        expect(decodeResult).toBe(true);
    });

    // cancel
    it('should return false when cancel input is wrong', function () {

    });

    it('should return true when cancel input is right', function () {

    });
});

describe("TestBooking", function() {
    
    // fail
    it('should return false when time is not the whole point', function () {

    });

    it('should return false when time is not during the correct time', function () {

    });

    it('should return false when the court is being booked', function () {

    });
    
    // success
    it('should return true when the time is cross the time', function () {

    });

    it('should return true when the time is not cross the time', function () {

    });
});
