
/**
 * utility type to centralize logic used in multiple places
 *
 * @author h.fleischer
 * @since 09.01.2022
 */
export class ObjectUtil {

    /**
     * create a unique 6-digit id
     * @returns
     */
    static createId(): string {
        return Math.round(Math.random() * 100000000).toString(16).substring(0, 5);
    }

    /**
     * create a unique download name
     * @returns
     */
    static createDownloadName(): string {
        return `co2_chart_${Date.now()}`;
    }

    static isEqual(obj1: any, obj2: any): boolean {

        var props1 = Object.getOwnPropertyNames(obj1);
        var props2 = Object.getOwnPropertyNames(obj2);

        if (props1.length !== props2.length) {
            return false;
        }

        for (var i = 0; i < props1.length; i++) {
            let val1 = obj1[props1[i]];
            let val2 = obj2[props1[i]];
            let isObjects = ObjectUtil.isObject(val1) && ObjectUtil.isObject(val2);
            let isFunctions = ObjectUtil.isFunction(val1) && ObjectUtil.isFunction(val2);
            if (isFunctions) {
                continue;
            }
            if (isObjects) {
                if (!ObjectUtil.isEqual(val1, val2)) {
                    return false;
                }
            } else {
                if (val1 !== val2) {
                    return false;
                }
            }
        }
        return true;

    }

    static isObject(obj: any): boolean {
        return obj != null && typeof obj === 'object';
    }

    static isFunction(obj: any): boolean {
        return obj != null && typeof obj === 'function';
    }


}