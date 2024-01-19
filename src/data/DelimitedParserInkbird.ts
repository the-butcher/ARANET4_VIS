import { IRecord, IUiProps } from "../components/IUiProps";
import { TimeUtil } from "../util/TimeUtil";
import { IDelimitedParser } from "./IDelimitedParser";

/**
 * Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)
 */
export class DelimitedParserInkbird implements IDelimitedParser {

    private static readonly HEADER_NAME_TIME = 'Time';
    private static readonly HEADER_NAME__CO2 = 'Co2';

    acceptsHeaders(line: string): boolean {
        const headers = line.split(/[\t]/).map(h => h.trim());
        return headers.indexOf(DelimitedParserInkbird.HEADER_NAME_TIME) === 0 && headers.indexOf(DelimitedParserInkbird.HEADER_NAME__CO2) === 1;
    }

    parseLines(lines: string[]): Promise<Pick<IUiProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {

            const dateParser = TimeUtil.DATE_PARSERS["mm/dd/yyyy"]
            const records: IRecord[] = [];

            // Time	Co2	Unit
            for (var lineIndex = 1; lineIndex < lines.length - 1; lineIndex += 1) {

                const values = lines[lineIndex].split('\t');
                if (values[1]) {
                    records.push({
                        instant: dateParser.parseDate(values[0]).getTime(),
                        co2: parseInt(values[1])
                    });
                }

            }
            resolve({
                type: 'Inkbird',
                records
            });

        });
    }

}