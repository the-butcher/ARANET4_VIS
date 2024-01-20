import { Tab, Tabs } from '@mui/material';
import 'moment/locale/de';
import { useEffect, useState } from 'react';
import ChartOptionsComponent from './ChartOptionsComponent';
import DividerComponent from './DividerComponent';
import { IUiProps, SPAN_TYPE } from './IUiProps';
import TimeSpanListComponent from './TimeSpanListComponent';

export type TAB_TYPE = SPAN_TYPE | 'options';

export const TAB_DEFS: { [K in TAB_TYPE]: string } = {
    display: 'DISPLAY',
    markers: 'MARKERS',
    options: 'OPTIONS'
};

const StepComponentRange = (props: IUiProps) => {

    const { timeSpans, chartOptions, handleTimeSpanUpdate } = { ...props };

    const [activeTabName, setActiveTabName] = useState<TAB_TYPE>('display');

    useEffect(() => {
        console.debug('✨ building ranges component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Tabs
                value={activeTabName}
                onChange={(e, v) => setActiveTabName(v as SPAN_TYPE)}
                sx={{ padding: '0px', margin: '0px', minHeight: 'unset!important', position: 'relative', top: '8px' }}
            >
                {Object.keys(TAB_DEFS).map(k => (
                    <Tab
                        key={k}
                        value={k}
                        label={TAB_DEFS[k as SPAN_TYPE]}
                        sx={{ padding: '0px', margin: '0px', minHeight: '30px', borderWidth: '5px' }}
                    />
                ))}
            </Tabs>
            <DividerComponent style={{ position: 'relative', top: '-1px' }} title={activeTabName} />
            {
                activeTabName === 'display' || activeTabName === 'markers' ? <TimeSpanListComponent
                    spanType={activeTabName}
                    timeSpans={timeSpans}
                    handleTimeSpanUpdate={handleTimeSpanUpdate}
                /> : <ChartOptionsComponent {...chartOptions} />
            }
        </>
    );

}

export default StepComponentRange;