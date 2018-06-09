const BadmintonManager = require('../BadmintonManager');

const MoneyManager = require('../MoneyManager');
const PrintManager = require('../PrintManager');

beforeEach(function () {
    BadmintonManager.schedule = {};
});

describe("TestInput", function () {

    // booking
    it("should return error when booking input length is wrong", function () {
        // given
        let input = 'U123U2016-06-02 20:00~22:00 A';
        // when
        const testManager = new BadmintonManager();
        // then
        expect(function () {
            testManager.decodeInput(input);
        }).toThrow();
    });


    it('should return right when booking input is right', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A';
        // when
        const testManager = new BadmintonManager();
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
        const testManager = new BadmintonManager();
        // then
        expect(function () {
            testManager.decodeInput(input);
        }).toThrow();
    });

    it('should return true when cancel input is right', function () {
        // given
        let input = 'U123 2018-06-09 20:00~22:00 A C';
        // when
        const testManager = new BadmintonManager();
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
        const testManager = new BadmintonManager();
        // then
        expect(function () {
            testManager.book(testManager.decodeInput(input))
        }).toThrow();
    });
});

describe("TestBooking", function () {

    // 测试预定冲突方法
    it('should return false if is conflict', function () {
        const testManager = new BadmintonManager(9, 22);
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

    // 测试整点检测方法
    it('should return true if in valid period', function () {
        let start = '09:00';
        let end = '12:00';
        const testManager = new BadmintonManager(9, 22);
        expect(testManager.isValidPeriod(start, end)).toBeTruthy();
    });

    // 测试非整点预定和早于营业时间预定
    it('should return false if not in valid period', function () {
        const testManager = new BadmintonManager(9, 22);
        expect(testManager.isValidPeriod('09:30', '12:00')).toBeFalsy();
        expect(testManager.isValidPeriod('08:00', '12:00')).toBeFalsy();

    });

    // 正常预定
    it('should return true when the time is not cross the time', function () {
        // given
        let input = 'U123 2018-06-09 20:00~21:00 A';
        const testManager = new BadmintonManager(9, 22);
        // when
        let result = testManager.book(testManager.decodeInput(input));
        // then
        expect(result).toEqual('Success: the booking is accepted!');
        expect(BadmintonManager.schedule).toEqual({
            '2018-06-09': {
                'A': [...'000000000000000000001000']
            }
        })
    });

    // 冲突预定
    it('should throw error if booking is conflict', function () {
        const testManager = new BadmintonManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '20:00',
            end: '22:00',
            courtId: 'A'
        });
        expect(function () {
            testManager.book({
                uid: 'U123',
                date: '2018-06-10',
                weekday: 0,
                start: '20:00',
                end: '22:00',
                courtId: 'A'
            });
        }).toThrow();
    });
});


describe("TestCancelBooking", function () {
    // 正确取消整段预定
    it('should cancel the whole booking of the user', function () {
        const testManager = new BadmintonManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '18:00',
            end: '22:00',
            courtId: 'A'
        });

        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '12:00',
            end: '13:00',
            courtId: 'A'
        });

        expect(testManager.cancel({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '18:00',
            end: '22:00',
            courtId: 'A',
            purpose: 'C'
        })).toBe('Success: the booking is cancelled!');

        let bookResult = testManager.book({
            uid: 'U133',
            date: '2018-06-10',
            weekday: 0,
            start: '18:00',
            end: '22:00',
            courtId: 'A'
        });

        expect(bookResult).toEqual('Success: the booking is accepted!');

    });

    // 取消部分预定
    it('should cancel failed if not the whole booking of the user', function () {
        const testManager = new BadmintonManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '12:00',
            end: '14:00',
            courtId: 'A'
        });

        expect(function () {
            testManager.cancel({
                uid: 'U123',
                date: '2018-06-10',
                weekday: 0,
                start: '12:00',
                end: '13:00',
                courtId: 'A',
                purpose: 'C'
            })
        }).toThrow();

        // 用户名错误
        expect(function () {
            testManager.cancel({
                uid: 'U223',
                date: '2018-06-10',
                weekday: 0,
                start: '12:00',
                end: '13:00',
                courtId: 'A',
                purpose: 'C'
            })
        }).toThrow();

        // 因为取消失败，所以预定失败
        expect(function () {
            testManager.book({
                uid: 'U323',
                date: '2018-06-10',
                weekday: 0,
                start: '12:00',
                end: '14:00',
                courtId: 'A'
            })
        }).toThrow();
    });
});

describe("TestMoney", function () {
    it('should calculate book money right', function () {
        new MoneyManager();
        expect(MoneyManager.calBook(6, '09:00', '22:00')).toBe(40 * 3 + 50 * 6 + 4 * 60);
        expect(MoneyManager.calBook(5, '09:00', '22:00')).toBe(30 * 3 + 50 * 6 + 80 * 2 + 2 * 60);
    });

    it('should calculate cancel money right', function () {
        new MoneyManager();
        expect(MoneyManager.calCancel(6, '09:00', '22:00')).toBe((40 * 3 + 50 * 6 + 4 * 60) * 0.25);
        expect(MoneyManager.calCancel(5, '09:00', '22:00')).toBe((30 * 3 + 50 * 6 + 80 * 2 + 2 * 60) * 0.5);
    });
});


describe("TestPrint", function () {
    it('should print right without cancel money', function () {
        const testManager = new BadmintonManager(9, 22);
        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '12:00',
            end: '14:00',
            courtId: 'A'
        });

        testManager.book({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '16:00',
            end: '18:00',
            courtId: 'A'
        });

        testManager.cancel({
            uid: 'U123',
            date: '2018-06-10',
            weekday: 0,
            start: '16:00',
            end: '18:00',
            courtId: 'A',
            purpose: 'C'
        });
        // 测试带违约金的情况
        expect(PrintManager.print(BadmintonManager.records)).toEqual('收入汇总' + '\n'
            + '---' + '\n'
            + '场地:A' + '\n'
            + '2018-06-10 12:00~14:00 100元' + '\n'
            + '2018-06-10 16:00~18:00 违约金 25元' + '\n'
            + '小计: 125元' + '\n\n'

            + '场地:B' + '\n'
            + '小计: 0元' + '\n\n'

            + '场地:C' + '\n'
            + '小计: 0元' + '\n\n'

            + '场地:D' + '\n'
            + '小计: 0元' + '\n\n'

            + '---' + '\n'
            + '总计: 125元');
        testManager.book({
            uid: 'U123',
            date: '2018-06-08',
            weekday: 5,
            start: '18:00',
            end: '20:00',
            courtId: 'B'
        });
        // 测试多场地多日期（包含工作日和周末）
        expect(PrintManager.print(BadmintonManager.records)).toEqual('收入汇总' + '\n'
            + '---' + '\n'
            + '场地:A' + '\n'
            + '2018-06-10 12:00~14:00 100元' + '\n'
            + '2018-06-10 16:00~18:00 违约金 25元' + '\n'
            + '小计: 125元' + '\n\n'

            + '场地:B' + '\n'
            + '2018-06-08 18:00~20:00 160元' + '\n'
            + '小计: 160元' + '\n\n'

            + '场地:C' + '\n'
            + '小计: 0元' + '\n\n'

            + '场地:D' + '\n'
            + '小计: 0元' + '\n\n'

            + '---' + '\n'
            + '总计: 285元');
    });

});