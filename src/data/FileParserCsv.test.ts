import { DelimitedParserAranet } from "./DelimitedParserAranet";
import { DelimitedParserInkbird } from "./DelimitedParserInkbird";
import { DelimitedParserMoth } from "./DelimitedParserMoth";
import { FileParserCsv } from "./FileParserCsv";

test('it finds the correct delimited parser', () => {

    expect(new FileParserCsv().findDelimitedParser('Time	Co2	Unit')).toBeInstanceOf(DelimitedParserInkbird);

    expect(new FileParserCsv().findDelimitedParser('time; co2; temperature; humidity; temperature_bme; humidity_bme; pressure; percent')).toBeInstanceOf(DelimitedParserMoth);

    expect(new FileParserCsv().findDelimitedParser('Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeInstanceOf(DelimitedParserAranet);
    expect(new FileParserCsv().findDelimitedParser('Time(mm/dd/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeInstanceOf(DelimitedParserAranet);
    expect(new FileParserCsv().findDelimitedParser('Time(DD/MM/YYYY H:mm:ss),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeInstanceOf(DelimitedParserAranet);

    expect(new FileParserCsv().findDelimitedParser('Time(xx/dd/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)')).toBeUndefined();

});

test('it provides the correct mime type', () => {

    expect(new FileParserCsv().getAcceptableMimeTypes().length).toBe(1);
    expect(new FileParserCsv().getAcceptableMimeTypes()).toContain('text/csv');

});

test('it correctly splits to lines', () => {

    expect(new FileParserCsv().splitToLines('a\nb\nc').length).toBe(3);
    expect(new FileParserCsv().splitToLines('a\nb\n\nc').length).toBe(3);

});