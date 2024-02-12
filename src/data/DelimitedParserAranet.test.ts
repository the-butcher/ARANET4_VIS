import { DelimitedParserAranet } from "./DelimitedParserAranet";

test('it accepts correct headers', () => {

    expect(new DelimitedParserAranet().acceptsHeaders('Time(mm/dd/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeTruthy();
    expect(new DelimitedParserAranet().acceptsHeaders('Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeTruthy();
    expect(new DelimitedParserAranet().acceptsHeaders('Time(DD/MM/YYYY H:mm:ss),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeTruthy();

    expect(new DelimitedParserAranet().acceptsHeaders('Time(dd/mm/yyyy),Carbon dioxide(deg),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeFalsy();
    expect(new DelimitedParserAranet().acceptsHeaders('Time(xx/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeFalsy();

});

test('it resolves the correct date parser', () => {

    expect(new DelimitedParserAranet().findDateParser('Time(mm/dd/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')?.[0]).toBe('mm/dd/yyyy');
    expect(new DelimitedParserAranet().findDateParser('Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')?.[0]).toBe('dd/mm/yyyy');

});