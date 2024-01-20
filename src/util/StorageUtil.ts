import { IDataProps, IUiProps } from "../components/IUiProps";

/**
 * helper type for writing / loading modifications to / from local storage
 *
 * @author h.fleischer
 * @since 25.05.2021
 */
export class StorageUtil {

    static STORAGE_ENABLED: boolean = false;

    static DATA_PROPS_ID = 'DT_PROPS_0';


    static clearUiProps(key: string): void {
        if (this.isStorageEnabled()) {
            localStorage.removeItem(key);
        }
    }

    static storeUiProps(key: string, props: IUiProps): void {
        if (this.isStorageEnabled()) {
            localStorage.setItem(key, JSON.stringify(props));
        }
    }

    static storeDataProps(key: string, props: IDataProps): void {
        if (this.isStorageEnabled()) {
            localStorage.setItem(key, JSON.stringify(props));
        }
    }

    static hasProps(key: string): boolean {
        if (this.isStorageEnabled()) {
            const loadedPropsRaw = localStorage.getItem(key);
            if (loadedPropsRaw) {
                return true;
            }
        }
        return false;
    }

    static loadUiProps(key: string): IUiProps | undefined {
        if (this.isStorageEnabled()) {
            const loadedPropsRaw = localStorage.getItem(key);
            if (loadedPropsRaw) {
                const loadedProps = JSON.parse(loadedPropsRaw) as IUiProps;
                return loadedProps;
            }

        }
    }

    static loadDataProps(key: string): IDataProps | undefined {
        if (this.isStorageEnabled()) {
            const loadedPropsRaw = localStorage.getItem(key);
            if (loadedPropsRaw) {
                const loadedProps = JSON.parse(loadedPropsRaw) as IDataProps;
                return loadedProps;
            }

        }
    }

    static isStorageEnabled(): boolean {
        if (!this.STORAGE_ENABLED) {
            this.STORAGE_ENABLED = this.evalStorageEnabled();
        }
        return this.STORAGE_ENABLED;
    }

    private static evalStorageEnabled(): boolean {
        let storage;
        try {
            storage = window.localStorage
            const testItem = '__storage_test__';
            storage.setItem(testItem, testItem);
            storage.removeItem(testItem);
            return true;
        } catch (e) {
            return false;
        }
    }

}