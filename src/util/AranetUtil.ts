import { IRecord } from "../components/IUiProps";

type DATE_FORMATS = "dd/mm/yyyy" | "mm/dd/yyyy";
interface IDateParser {
    parseDate: (d: string) => Date;
}
/**
 * dates appear to be exported in local time
 */
const DATE_PARSERS: { [K in DATE_FORMATS]: IDateParser } = {
    "dd/mm/yyyy": {
        parseDate: d => {
            const values = d.split(/[/:. ]/g).map(t => parseInt(t));
            return new Date(values[2], values[1] - 1, values[0], values[3], values[4], values[5]);
        }
    },
    "mm/dd/yyyy": {
        parseDate: d => {
            const values = d.split(/[/:. ]/g).map(t => parseInt(t));
            return new Date(values[2], values[0] - 1, values[1], values[3], values[4], values[5]);
        }
    }
}

export class AranetUtil {

    static splitToLines(text: string): string[] {
        return text.toString().split("\n").filter(l => l !== undefined);
    }

    static parseFile(text: string): IRecord[] {

        if (text.startsWith("Time")) {

            let lines = AranetUtil.splitToLines(text);
            if (lines.length > 1) {

                const headers = lines[0].split(',').map(h => h.trim());
                if (headers.length > 1) {

                    const dateParser = Object.entries(DATE_PARSERS).find(e => headers[0].indexOf(e[0]) > 0);
                    if (dateParser) {

                        const records: IRecord[] = [];

                        lines = lines.map(l => l.replace(/,"/g, ';"').replace(/,/g, '.').replace(/"/g, ''));
                        for (var lineIndex = 1; lineIndex < lines.length - 1; lineIndex += 1) {

                            const values = lines[lineIndex].split(';');
                            if (values[1]) {
                                records.push({
                                    instant: dateParser[1].parseDate(values[0]).getTime(),
                                    co2: parseInt(values[1])
                                });
                            }

                        }

                        return records;

                    } else {
                        throw new Error(`unknown date format :: ${headers[0]}`);
                    }

                } else {
                    throw new Error("file must have a valid set of headers");
                }

            } else {
                throw new Error("file must have more than one line");
            }

        } else {
            throw new Error("file must start with an aranet CSV header line");
        }

    }

}