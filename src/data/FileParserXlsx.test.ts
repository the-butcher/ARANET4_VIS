import { FileParserXlsx } from "./FileParserXlsx";

test('it provides the correct mime types', () => {

    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/vnd.ms-excel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/msexcel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/x-msexcel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/x-ms-excel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/x-excel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/x-dos_ms_excel');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/xls');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/x-xls');
    expect(new FileParserXlsx().getAcceptableMimeTypes()).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(new FileParserXlsx().getAcceptableMimeTypes().length).toBe(9);

});
