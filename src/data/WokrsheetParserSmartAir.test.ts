import { WorksheetParserSmartAir } from "./WorksheetParserSmartAir";

test('it has correct static variables', () => {

    expect(WorksheetParserSmartAir.HEADER_NAME_TIME).toBe('Time');
    expect(WorksheetParserSmartAir.HEADER_NAME__CO2).toBe('CO2 (ppm)');

});

test('it accepts correct headers', () => {

    expect(new WorksheetParserSmartAir().acceptsHeaders([
        'something',
        'Time',
        'CO2 (ppm)',
        'else'
    ])).toBeTruthy();

    expect(new WorksheetParserSmartAir().acceptsHeaders([
        'Time',
        'CO2 (ppm)',
        'something',
        'else'
    ])).toBeTruthy();

    expect(new WorksheetParserSmartAir().acceptsHeaders([
        'something',
        'CO2 (ppm)',
        'else'
    ])).toBeFalsy();

    expect(new WorksheetParserSmartAir().acceptsHeaders([])).toBeFalsy();

});