import { DelimitedParserInkbird } from "./DelimitedParserInkbird";

test('it accepts correct headers', () => {

    expect(new DelimitedParserInkbird().acceptsHeaders('Time	Co2	Unit')).toBeTruthy();

    expect(new DelimitedParserInkbird().acceptsHeaders('Time Co2 Unit')).toBeFalsy();

});