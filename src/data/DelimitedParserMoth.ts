import { IDataProps, IRecord } from "../components/IUiProps";
import { TimeUtil } from "../util/TimeUtil";
import { IDelimitedParser } from "./IDelimitedParser";

/**
 * Time(dd/mm/yyyy),Carbon dioxide(ppm),Temperature(°C),Relative humidity(%),Atmospheric pressure(hPa)
 */
export class DelimitedParserMoth implements IDelimitedParser {

    private static readonly HEADER_NAME_TIME = 'time';
    private static readonly HEADER_NAME__CO2 = 'co2';

    /**
     * time; co2; temperature; humidity; temperature_bme; humidity_bme; pressure; percent
     * @param line
     * @returns
     */
    acceptsHeaders(line: string): boolean {
        const headers = line.split(/;/).map(h => h.trim());
        return headers.indexOf(DelimitedParserMoth.HEADER_NAME_TIME) === 0 && headers.indexOf(DelimitedParserMoth.HEADER_NAME__CO2) === 1;
    }

    parseLines(lines: string[]): Promise<Pick<IDataProps, 'type' | 'records'>> {
        return new Promise((resolve, reject) => {

            // const dateParser = TimeUtil.DATE_PARSERS["mm/dd/yyyy"]
            const records: IRecord[] = [];

            // Time	Co2	Unit
            for (var lineIndex = 1; lineIndex < lines.length - 1; lineIndex += 1) {

                const values = lines[lineIndex].split(';').map(h => h.trim());
                if (values[1]) {
                    records.push({
                        instant: new Date(values[0]).getTime(), // dateParser.parseDate(values[0]).getTime(),
                        co2: parseInt(values[1])
                    });
                }

            }
            resolve({
                type: 'Moth',
                records
            });

        });
    }

}