import { IUiProps } from "../components/IUiProps";

/**
 * helper type for writing / loading modifications to / from local storage
 *
 * @author h.fleischer
 * @since 25.05.2021
 */
export class StorageUtil {

    static readonly STORAGE_KEY_UI_PROPS = 'UI_PROPS_3';
    static STORAGE_ENABLED: boolean = false;

    static storeUiProps(props: IUiProps): void {
        if (this.isStorageEnabled()) {
            localStorage.setItem(StorageUtil.STORAGE_KEY_UI_PROPS, JSON.stringify(props));
        }
    }

    static loadProps(): IUiProps | undefined {

        if (this.isStorageEnabled()) {

            const loadedPropsRaw = localStorage.getItem(StorageUtil.STORAGE_KEY_UI_PROPS);
            if (loadedPropsRaw) {
                const loadedProps = JSON.parse(loadedPropsRaw) as IUiProps;
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