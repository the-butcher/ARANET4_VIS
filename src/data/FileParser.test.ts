import { FileParser } from "./FileParser";
import { FileParserCsv } from "./FileParserCsv";
import { FileParserXlsx } from "./FileParserXlsx";

test('it finds the correct file parser', () => {

    expect(new FileParser().findFileParser('text/csv')).toBeInstanceOf(FileParserCsv);

    expect(new FileParser().findFileParser('application/vnd.ms-excel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/msexcel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/x-msexcel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/x-ms-excel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/x-excel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/x-dos_ms_excel')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/xls')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/x-xls')).toBeInstanceOf(FileParserXlsx);
    expect(new FileParser().findFileParser('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')).toBeInstanceOf(FileParserXlsx);

    expect(new FileParser().findFileParser('')).toBeUndefined();

});

test('it provides the correct mime type', () => {

    expect(new FileParser().getAcceptableMimeTypes()).toContain('text/csv');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/vnd.ms-excel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/msexcel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/x-msexcel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/x-ms-excel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/x-excel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/x-dos_ms_excel');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/xls');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/x-xls');
    expect(new FileParser().getAcceptableMimeTypes()).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(new FileParser().getAcceptableMimeTypes().length).toBe(10);

});