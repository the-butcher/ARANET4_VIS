export type DAY_OF_WEEK = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export const DAYS_OF_WEEK: DAY_OF_WEEK[] = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
];
export const INDICES_OF_DAYS: DAY_OF_WEEK[] = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
];

export type SPAN_TYPE = 'display' | 'markers';

export interface IRecord {
    instant: number;
    co2: number;
}

export interface ITimeSpan {
    instantMin: number;
    instantMax: number;
}

export interface ITimeSpanNamed extends ITimeSpan {
    uuid: string;
    title: string;
    days: DAY_OF_WEEK[];
    spanType: SPAN_TYPE;
}

export interface IChartOptions {
    title: string;
    showGradientFill: boolean;
    showGradientStroke: boolean;
    strokeWidth: number;
    fontSize: number;
    showDates: boolean;
}

export interface IUiProps {
    name: string;
    records: IRecord[];
    timeSpanData: ITimeSpan;
    timeSpanUser: ITimeSpan;
    timeSpans: ITimeSpanNamed[],
    chartOptions: IChartOptions,
    handleRecordUpdate: (name: string, records: IRecord[]) => void;
    handleTimeSpanUserUpdate: (timeSpanUser: ITimeSpan) => void;
    handleTimeSpanUpdate: (timeSpan: ITimeSpanNamed) => void;
    handleChartOptionsUpdate: (update: Partial<IChartOptions>) => void;
}