import xlsx from 'node-xlsx';
import { IUiProps } from "../components/IUiProps";
import { IFileParser } from "./IFileParser";
import { WorksheetParserSmartAir } from "./WorksheetParserSmartAir";


export class FileParserXlsx implements IFileParser {

    private static ACCEPTABLE_MIME_TYPES: string[] = [
        'application/vnd.ms-excel',
        'application/msexcel',
        'application/x-msexcel',
        'application/x-ms-excel',
        'application/x-excel',
        'application/x-dos_ms_excel',
        'application/xls',
        'application/x-xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    private readonly worksheetParserSmartAir: WorksheetParserSmartAir;

    constructor() {
        this.worksheetParserSmartAir = new WorksheetParserSmartAir();
    }

    async parseFile(file: File): Promise<Pick<IUiProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = e => {
                // @ts-ignore
                const workSheetsFromFile = xlsx.parse(e.target.result);
                if (workSheetsFromFile.length > 0) {
                    if (workSheetsFromFile[0].data.length > 0) {

                        const data = workSheetsFromFile[0].data;
                        if (this.worksheetParserSmartAir.acceptsHeaders(data[0])) {
                            this.worksheetParserSmartAir.parseData(data).then(records => {
                                resolve(records);
                            }).catch((e: Error) => {
                                reject(e);
                            });
                        }

                    } else {
                        reject(new Error(`worksheet "${workSheetsFromFile[0].name}" contains no data`));
                    }
                } else {
                    reject(new Error('file containes no worksheets'));
                }
            }
            reader.readAsArrayBuffer(file);
        });
    }

    getAcceptableMimeTypes(): string[] {
        return FileParserXlsx.ACCEPTABLE_MIME_TYPES;
    }

}