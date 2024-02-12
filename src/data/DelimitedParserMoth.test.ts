import { DelimitedParserMoth } from "./DelimitedParserMoth";

test('it accepts correct headers', () => {

    expect(new DelimitedParserMoth().acceptsHeaders('time; co2; temperature; humidity; temperature_bme; humidity_bme; pressure; percent')).toBeTruthy();

    expect(new DelimitedParserMoth().acceptsHeaders('time, co2, temperature, humidity, temperature_bme, humidity_bme, pressure, percent')).toBeFalsy();

});