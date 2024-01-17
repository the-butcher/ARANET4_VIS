/**
 * utility class for managing time related units
 *
 * @author h.fleischer
 * @since 25.05.2021
 */
export class TimeUtil {

    static readonly MILLISECONDS_PER_MINUTE = 60 * 1000;
    static readonly MILLISECONDS_PER___HOUR = 60 * TimeUtil.MILLISECONDS_PER_MINUTE;
    static readonly MILLISECONDS_PER____DAY: number = 24 * TimeUtil.MILLISECONDS_PER___HOUR;
    static readonly MILLISECONDS_PER___WEEK: number = TimeUtil.MILLISECONDS_PER____DAY * 7;
    static readonly MILLISECONDS_PER___YEAR: number = TimeUtil.MILLISECONDS_PER____DAY * 365;

    static formatCategoryDateFull(instant: number): string {
        const date = new Date(instant);
        return date.toLocaleDateString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).replace(',', '');
    }

    static toTimeOnlyDate(): number {
        return Date.now() % this.MILLISECONDS_PER____DAY;
    }

    /**
     * gets the local midnight (00:00:00) prior to the given instant
     * @param instant
     * @returns
     */
    static toInstantMinUser(instant: number) {
        const dateMin = new Date(instant);
        dateMin.setHours(0, 0, 0, 0);
        return dateMin.getTime();
    }

    /**
     * gets the local midnight (23:59:59) after to the given instant
     * @param instant
     * @returns
     */
    static toInstantMaxUser(instant: number) {
        const dateMin = new Date(instant);
        dateMin.setHours(23, 59, 59, 0);
        return dateMin.getTime();
    }

    static toLocalInstant(instant: number) {
        const date = new Date(instant);
        date.setHours(date.getUTCHours());
        return date.getTime();
    }

}