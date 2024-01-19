import { IUiProps } from "../components/IUiProps";
import { FileParserCsv } from "./FileParserCsv";
import { FileParserXlsx } from "./FileParserXlsx";
import { IFileParser } from "./IFileParser";


/**
 * primary entrypoint for parsing data files
 * it will make a distinction between csv and xlsx, then pass on to respective subparsers
 */
export class FileParser implements IFileParser {

    public static INSTANCE: IFileParser = new FileParser();

    private readonly fileParsers: IFileParser[];

    constructor() {
        this.fileParsers = [
            new FileParserCsv(),
            new FileParserXlsx()
        ]
    }

    findFileParser(type: string): IFileParser | undefined {
        return this.fileParsers.find(p => p.getAcceptableMimeTypes().find(t => t === type));
    }

    async parseFile(file: File): Promise<Pick<IUiProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {
            const fileParser = this.findFileParser(file.type);
            if (fileParser) {
                fileParser.parseFile(file).then(records => {
                    resolve(records);
                }).catch((e: Error) => {
                    reject(e);
                });
            } else {
                reject(new Error(`invalid mime type: ${file.type}`));
            }
        });
    }

    getAcceptableMimeTypes(): string[] {
        const acceptableMimeTypes: string[] = [];
        this.fileParsers.forEach(fileParser => {
            acceptableMimeTypes.push(...fileParser.getAcceptableMimeTypes());
        });
        return acceptableMimeTypes;
    }

}