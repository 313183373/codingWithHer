const TennisManager = require('../TennisManager');

describe("BookingTest", function() {
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