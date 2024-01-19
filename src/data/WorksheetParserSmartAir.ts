import { IRecord, IUiProps } from "../components/IUiProps";
import { IWorksheetParser } from "./IWorksheetParser";

/**
 * 'Time', 'Temperature (°C)', 'Humidity (%)', 'CO2 (ppm)', 'Type'
 */
export class WorksheetParserSmartAir implements IWorksheetParser {

    static readonly HEADER_NAME_TIME = 'Time';
    static readonly HEADER_NAME__CO2 = 'CO2 (ppm)';

    acceptsHeaders(headers: any[]): boolean {
        return headers.indexOf(WorksheetParserSmartAir.HEADER_NAME_TIME) >= 0 && headers.indexOf(WorksheetParserSmartAir.HEADER_NAME__CO2) >= 0;
    }

    async parseData(data: any[][]): Promise<Pick<IUiProps, 'type' | 'records'>> {
        const headers = data[0];
        const headerIndexTime = headers.indexOf(WorksheetParserSmartAir.HEADER_NAME_TIME);
        const headerIndexCo2 = headers.indexOf(WorksheetParserSmartAir.HEADER_NAME__CO2);
        const records: IRecord[] = [];
        for (let index = 1; index < data.length; index++) {
            records.push({
                instant: new Date(data[index][headerIndexTime]).getTime(),
                co2: data[index][headerIndexCo2]
            });
        }
        return {
            type: 'SmartAir',
            records
        };
    }

}