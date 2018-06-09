const TennisManager = require('../TennisManager');

describe("TestInput", function() {
    it("should return error when input is wrong", function() {
        // given
        let input = 'abd14';
        // when
        const testManager = new TennisManager();
        const decodeResult = testManager.decodeInput(input);
        // then
        expect(decodeResult).toThrow(new Error('the booking is invalid'));
    });


    it('should return right when input is right', function () {
        // given
        let input = 'abd14';
        // when
        const testManager = new TennisManager();
        const decodeResult = testManager.decodeInput(input);
        // then
        expect(decodeResult).toBe(true);
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