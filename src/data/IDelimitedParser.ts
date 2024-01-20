import { IDataProps } from "../components/IUiProps";

/**
 * definition for types that take care of parsing records from a delimited (comma, semicolon, tab, ...) file
 *
 * @author h.fleischer
 * @since 19.01.2024
 */
export interface IDelimitedParser {

  /**
   * check if this parser accepts (aka is compatible) with the given header line
   * @param headers
   */
  acceptsHeaders(headers: string): boolean;

  /**
    * parse an array of records from the given array of csv lines
    * @param file
    */
  parseLines(lines: string[]): Promise<Pick<IDataProps, 'type' | 'records'>>;

}