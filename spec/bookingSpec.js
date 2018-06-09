const TennisManager = require('../TennisManager');
const User = require('../User');

beforeEach(function() {
    TennisManager.schedule = {};
});

describe("TestInput", function () {

    // booking
    it("should return error when booking input length is wrong", function () {
        // given
        let input = 'U123U2016-06-02 20:00~22:00 A';
        // when
        const testManager = new TennisManager();
        // then
        expect(function () {
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
            uid: 'U123',
            date: '2018-06-09',
            weekday: 6,
            start: '20:00',
            end: '22:00',
            courtId: 'A',
            purpose: 'B'
        });
    });

    // cancel
    it('should return false when cancel input is wrong', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A W';
        // when
        const testManager = new TennisManager();
        // then
        expect(function () {
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
            uid: 'U123',
            date: '2018-06-09',
            weekday: 6,
            start: '20:00',
            end: '22:00',
            courtId: 'A',
            purpose: 'C'
        });
    });

    it('should return false when booking input start > end', function () {
        let input = 'U123 2018-06-09 22:00~20:00 A C';
        // when
        const testManager = new TennisManager();
        // then
        expect(function(){
            testManager.book(testManager.decodeInput(input))
        }).toThrow();
    });
});

describe("TestBooking", function () {

    // 正常预定
    it('should return true when the time is not cross the time', function () {
        // given
        let input = 'U123 2018-06-09 20:00~21:00 A';
        const testManager = new TennisManager(9, 22);
        // when
        let result = testManager.book(testManager.decodeInput(input));
        // then
        expect(result).toEqual('Success: the booking is accepted!');
        expect(TennisManager.schedule).toEqual({
            '2018-06-09': {
                'A': [...'000000000000000000001000']
            }
        })
    });

    // 合法时期
    it('should return true if in valid period', function () {
        let start = '09:00';
        let end = '12:00';
        const testManager = new TennisManager(9, 22);
        expect(testManager.isValidPeriod(start, end)).toBeTruthy();
    });

    // 测试非整点预定和早于营业时间预定
    it('should return false if not in valid period', function () {
        const testManager = new TennisManager(9, 22);
        expect(testManager.isValidPeriod('09:30', '12:00')).toBeFalsy();
        expect(testManager.isValidPeriod('08:00', '12:00')).toBeFalsy();

    });

    // 测试预定冲突
    it('should return false if is conflict', function () {
        const testManager = new TennisManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '20:00',
            end: '22:00',
            courtId: 'A'
        });
        expect(testManager.isConflict('2018-06-10', '20:00', '21:00', 'A')).toBeTruthy();
    });
});


describe("TestCancelBooking", function () {
    // 正确取消整段预定
    it('should cancel the whole booking of the user', function () {
        const testManager = new TennisManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '20:00',
            end: '22:00',
            courtId: 'A'
        });

        expect(testManager.cancel({
            uid: 'U123',
            date: '2018-06-10',
            weekday:0,
            start:'20:00',
            end:'22:00',
            courtId: 'A',
            purpose: 'C'
        })).toBe('Success: the booking is cancelled!');
    });

    // 取消部分预定，错误
    it('should cancel failed if not the whole booking of the user', function () {
        const testManager = new TennisManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '20:00',
            end: '22:00',
            courtId: 'A'
        });

        expect(function() {
            testManager.cancel({
                uid: 'U123',
                date: '2018-06-10',
                weekday:0,
                start:'20:00',
                end:'21:00',
                courtId: 'A',
                purpose: 'C'
            })
        }).toThrow();
    });
});