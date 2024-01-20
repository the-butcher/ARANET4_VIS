import { IDataProps } from "../components/IUiProps";

/**
 * definition for types that take care of parsing records from a binary excel file
 *
 * @author h.fleischer
 * @since 19.01.2024
 */
export interface IWorksheetParser {

  /**
   * check if this parser accepts (aka is compatible) with the given set of headers
   * @param headers
   */
  acceptsHeaders(headers: any[]): boolean;

  /**
    * parse an array of records from the given set of data
    * @param file
    */
  parseData(data: any[][]): Promise<Pick<IDataProps, 'type' | 'records'>>;

}