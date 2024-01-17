import { TimeUtil } from "./TimeUtil";

test('to min instant', () => {

    const time = 1705502456000; // Wednesday, 17. January 2024 14:40:56, Mittwoch, 17. Januar 2024 15:40:56 GMT+01:00
    const expc = 1705446000000; // Tuesday, 16. January 2024 23:00:00, Mittwoch, 17. Januar 2024 00:00:00 GMT+01:00

    expect(TimeUtil.toInstantMinUser(time)).toBe(expc);

});

test('to max instant', () => {

    const time = 1705502456000; // Wednesday, 17. January 2024 14:40:56, Mittwoch, 17. Januar 2024 15:40:56 GMT+01:00
    const expc = 1705532399000; // Wednesday, 17. January 2024 22:59:59, Mittwoch, 17. Januar 2024 23:59:59 GMT+01:00

    expect(TimeUtil.toInstantMaxUser(time)).toBe(expc);

});
