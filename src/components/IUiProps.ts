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
}

export interface IChartOptions {
    title: string;
    showGradientFill: boolean;
    showGradientStroke: boolean;
    strokeWidth: number;
    fontSize: number;
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