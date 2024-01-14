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
        return date.toLocaleTimeString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).replace(',', '');
    }

    static toTimeOnlyDate(): number {
        return Date.now() % this.MILLISECONDS_PER____DAY;
    }

    static toMidnightInstant(instant: number) {
        return instant - instant % TimeUtil.MILLISECONDS_PER____DAY;
    }

}