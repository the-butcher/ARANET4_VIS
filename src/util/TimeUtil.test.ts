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

test('it has the correct date parsers', () => {

    expect(TimeUtil.DATE_PARSERS).toHaveProperty("dd/mm/yyyy");
    expect(TimeUtil.DATE_PARSERS).toHaveProperty("mm/dd/yyyy");

});

test('it parses dates correctly', () => {

    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getFullYear()).toBe(2024);
    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getMonth()).toBe(7);
    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getDate()).toBe(1);
    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getHours()).toBe(19);
    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getMinutes()).toBe(3);
    expect(TimeUtil.DATE_PARSERS["dd/mm/yyyy"].parseDate('01/08/2024 19:03:48').getSeconds()).toBe(48);

    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getFullYear()).toBe(2024);
    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getMonth()).toBe(0);
    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getDate()).toBe(8);
    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getHours()).toBe(19);
    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getMinutes()).toBe(3);
    expect(TimeUtil.DATE_PARSERS["mm/dd/yyyy"].parseDate('01/08/2024 19:03:48').getSeconds()).toBe(48);


});

