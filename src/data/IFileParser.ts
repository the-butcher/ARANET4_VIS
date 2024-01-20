import { IDataProps } from "../components/IUiProps";

/**
 * definition for types that take care of parsing records from a file
 *
 * @author h.fleischer
 * @since 19.01.2024
 */
export interface IFileParser {

    /**
     * get a list mime types that this parser may be able to process
     */
    getAcceptableMimeTypes(): string[];

    /**
     * parse an array of records from the given file
     * @param file
     */
    parseFile(file: File): Promise<Pick<IDataProps, 'type' | 'records'>>;

}