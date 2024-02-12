import { IDataProps, IRecord } from "../components/IUiProps";
import { IDateParser, TimeUtil } from "../util/TimeUtil";
import { IDelimitedParser } from "./IDelimitedParser";

/**
 * Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)
 */
export class DelimitedParserAranet implements IDelimitedParser {

    private static readonly HEADER_NAME_TIME_A = 'time(dd/mm/yyyy';
    private static readonly HEADER_NAME_TIME_B = 'time(mm/dd/yyyy';
    private static readonly HEADER_NAME__CO2 = 'Carbon dioxide(ppm)';

    acceptsHeaders(line: string): boolean {
        const headers = line.split(',').map(h => h.trim());
        return headers.some(h => (h.toLowerCase().startsWith(DelimitedParserAranet.HEADER_NAME_TIME_A) || h.toLowerCase().startsWith(DelimitedParserAranet.HEADER_NAME_TIME_B))) && headers.indexOf(DelimitedParserAranet.HEADER_NAME__CO2) >= 0;
        // return (headers.indexOf(DelimitedParserAranet.HEADER_NAME_TIME_A) >= 0 || headers.indexOf(DelimitedParserAranet.HEADER_NAME_TIME_B) >= 0) && headers.indexOf(DelimitedParserAranet.HEADER_NAME__CO2) >= 0;
    }

    findDateParser(line: string): [string, IDateParser] | undefined {
        return Object.entries(TimeUtil.DATE_PARSERS).find(e => line.toLowerCase().indexOf(e[0]) > 0);
    }

    parseLines(lines: string[]): Promise<Pick<IDataProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {

            const dateParser = this.findDateParser(lines[0]); // Object.entries(TimeUtil.DATE_PARSERS).find(e => lines[0].indexOf(e[0]) > 0);
            if (dateParser) {

                const records: IRecord[] = [];

                // 26/09/2023 7:26:38,"1126","23,3","55","1003,7"
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
                resolve({
                    type: 'Aranet4',
                    records
                });


            } else {
                reject(new Error(`unknown date format :: ${lines[0]}`));
            }

        });
    }

}