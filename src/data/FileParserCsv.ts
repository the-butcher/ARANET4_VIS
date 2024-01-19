import { IUiProps } from "../components/IUiProps";
import { DelimitedParserAranet } from "./DelimitedParserAranet";
import { DelimitedParserInkbird } from "./DelimitedParserInkbird";
import { IDelimitedParser } from "./IDelimitedParser";
import { IFileParser } from "./IFileParser";

export class FileParserCsv implements IFileParser {

    private static ACCEPTABLE_MIME_TYPES: string[] = [
        'text/csv'
    ];

    private readonly delimitedParsers: IDelimitedParser[];

    constructor() {
        this.delimitedParsers = [
            new DelimitedParserAranet(),
            new DelimitedParserInkbird()
        ]
    }

    splitToLines(text: string): string[] {
        return text.toString().split("\n").filter(l => l !== undefined && l !== '');
    }

    findDelimitedParser(line: string): IDelimitedParser | undefined {
        return this.delimitedParsers.find(p => p.acceptsHeaders(line));
    }

    async parseFile(file: File): Promise<Pick<IUiProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = e => {

                // @ts-ignore
                const text = e.target.result as string;
                let lines = this.splitToLines(text);
                if (lines.length > 1) {

                    const delimitedParser = this.findDelimitedParser(lines[0]);
                    if (delimitedParser) {
                        delimitedParser.parseLines(lines).then(records => {
                            resolve(records);
                        }).catch((e: Error) => {
                            reject(e);
                        });
                    } else {
                        reject(new Error(`invalid headers: ${lines[0]}`));
                    }

                } else {
                    reject(new Error('csv file must have more two or more lines'));
                }

            }
            reader.readAsText(file);
        });
    }

    getAcceptableMimeTypes(): string[] {
        return FileParserCsv.ACCEPTABLE_MIME_TYPES;
    }

}