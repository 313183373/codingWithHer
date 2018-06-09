const TennisManager = require('../TennisManager');

describe("TestInput", function() {

    // booking
    it("should return error when booking input is wrong", function() {
        // given
        let input = 'U123U2016-06-02 20:00~22:00 A';
        // when
        const testManager = new TennisManager();
        // then
        expect(function() {
            testManager.decodeInput(input);
        }).toThrow();
    });


    it('should return right when booking input is right', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A';
        // when
        const testManager = new TennisManager();
        // then
        expect(testManager.decodeInput(input)).toEqual({
            uid:'U123',
            date:'2018-06-09',
            weekday:6,
            start:'20:00',
            end:'22:00',
            courtId:'A',
            purpose:'B'
        });
    });

    // cancel
    it('should return false when cancel input is wrong', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A W';
        // when
        const testManager = new TennisManager();
        // then
        expect(function() {
            testManager.decodeInput(input);
        }).toThrow();
    });

    it('should return true when cancel input is right', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A C';
        // when
        const testManager = new TennisManager();
        // then
        expect(testManager.decodeInput(input)).toEqual({
            uid:'U123',
            date:'2018-06-09',
            weekday:6,
            start:'20:00',
            end:'22:00',
            courtId:'A',
            purpose:'C'
        });
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

