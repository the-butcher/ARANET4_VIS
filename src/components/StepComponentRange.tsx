import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import GradientIcon from '@mui/icons-material/Gradient';
import RedoIcon from '@mui/icons-material/Redo';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import UndoIcon from '@mui/icons-material/Undo';
import { Avatar, FormControl, IconButton, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/de';
import { useEffect, useState } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';
import { ThemeUtil } from '../util/ThemeUtil';
import { TimeUtil } from '../util/TimeUtil';
import DividerComponent from './DividerComponent';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed, IUiProps, SPAN_TYPE } from './IUiProps';
import MarkSpanComponent from './MarkSpanComponent';

let markSpanUpdateTimeout = -1;
let chartTitleUpdateTimeout = -1;

export const TAB_DEFS: { [K in SPAN_TYPE]: string } = {
    display: 'DISPLAY',
    markers: 'MARKERS'
};

const StepComponentRange = (props: IUiProps) => {

    const { timeSpanData, timeSpanUser, timeSpans, chartOptions, handleTimeSpanUserUpdate, handleMarkSpanUpdate, handleChartOptionsUpdate } = { ...props };

    const [activeTabName, setActiveTabName] = useState<SPAN_TYPE>('display');

    const [timeSpanNewOpacity, setTimeSpanNewOpacity] = useState<string>('0.5');

    const [formSpans, setFormSpans] = useState<ITimeSpanNamed[]>(timeSpans);
    const [formTitle, setFormTitle] = useState<string>(chartOptions.title);

    const [markSpanNew, setMarkSpanNew] = useState<ITimeSpanNamed>({
        uuid: ObjectUtil.createId(),
        title: '',
        instantMin: TimeUtil.toTimeOnlyDate(),
        instantMax: TimeUtil.toTimeOnlyDate(),
        days: [
            ...DAYS_OF_WEEK
        ],
        spanType: activeTabName
    });

    const handleChartTitleUpdate = (title: string) => {
        setFormTitle(title);
        window.clearTimeout(chartTitleUpdateTimeout);
        chartTitleUpdateTimeout = window.setTimeout(() => {
            handleChartOptionsUpdate({
                title
            })
        }, 500);
    }

    const handleDateUserMinChanged = (value: moment.Moment | null) => {
        if (value) {
            handleTimeSpanUserUpdate({
                ...timeSpanUser,
                instantMin: value.unix() * 1000
            })
        }
    }

    const handleDateUserMaxChanged = (value: moment.Moment | null) => {
        if (value) {
            handleTimeSpanUserUpdate({
                ...timeSpanUser,
                instantMax: value.unix() * 1000
            })
        }
    }

    const handleDateUserMove = (value: number) => {
        if (value) {
            handleTimeSpanUserUpdate({
                ...timeSpanUser,
                instantMin: timeSpanUser.instantMin + value,
                instantMax: timeSpanUser.instantMax + value
            })
        }
    }

    const handleMarkSpanMinChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            if (uuid === markSpanNew.uuid) {
                setMarkSpanNew({
                    ...markSpanNew,
                    instantMin: value.unix() * 1000
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        instantMin: value.unix() * 1000
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleMarkSpanMaxChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            if (uuid === markSpanNew.uuid) {
                setMarkSpanNew({
                    ...markSpanNew,
                    instantMax: value.unix() * 1000
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        instantMax: value.unix() * 1000
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleMarkSpanTitleChanged = (uuid: string, title: string) => {
        if (title) {
            if (uuid === markSpanNew.uuid) {
                setMarkSpanNew({
                    ...markSpanNew,
                    title
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        title
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleMarkSpanDaysChanged = (uuid: string, days: DAY_OF_WEEK[]) => {
        console.log('days', days)
        if (days) {
            if (uuid === markSpanNew.uuid) {
                setMarkSpanNew({
                    ...markSpanNew,
                    days: [
                        ...days
                    ]
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        days: [
                            ...days
                        ]
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleFormSpanUpdate = (_formSpan: ITimeSpanNamed) => {

        const _formSpans = formSpans.filter(t => t.uuid !== _formSpan.uuid);
        _formSpans.push(_formSpan);
        _formSpans.sort((a, b) => a.instantMin - b.instantMin);
        setFormSpans(_formSpans);

        window.clearTimeout(markSpanUpdateTimeout);
        markSpanUpdateTimeout = window.setTimeout(() => {
            handleMarkSpanUpdate(_formSpan);
        }, 500);

    }

    const handleMarkSpanAdd = () => {
        handleMarkSpanUpdate(markSpanNew);
    }

    const handleMarkSpanDelete = (uuid: string) => {
        const _markSpan = timeSpans.find(t => t.uuid === uuid);
        if (_markSpan) {
            handleMarkSpanUpdate({
                ..._markSpan,
                instantMin: -1,
                instantMax: -1,
            });
        }
    }

    useEffect(() => {
        console.debug('✨ building ranges component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpans, activeTabName)`, timeSpans, activeTabName);

        setMarkSpanNew({
            uuid: ObjectUtil.createId(),
            title: '',
            instantMin: TimeUtil.toTimeOnlyDate(),
            instantMax: TimeUtil.toTimeOnlyDate(),
            days: [
                ...DAYS_OF_WEEK
            ],
            spanType: activeTabName
        });
        setFormSpans(timeSpans.filter(s => s.spanType === activeTabName));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpans, activeTabName]);

    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpanData, timeSpanUser)`, timeSpanData, timeSpanUser);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanData, timeSpanUser]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DividerComponent />
            <Typography sx={{ paddingRight: '10px', marginBottom: '6px' }}>You can now specify the displayed date/time range with the 'min' and 'max' date pickers. It is also possible to create chart markers, i.e. to indicate a daily timetable.</Typography>
            <DividerComponent title='chart display range' />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: '46px' }}>
                <DateTimePicker
                    sx={{ margin: '6px', width: '220px' }}
                    label="min"
                    value={moment(new Date(timeSpanUser.instantMin))}
                    minDateTime={moment(new Date(timeSpanData.instantMin))}
                    maxDateTime={moment(new Date(timeSpanUser.instantMax))}
                    onChange={handleDateUserMinChanged}
                />
                <DateTimePicker
                    sx={{ margin: '6px', width: '220px' }}
                    label="max"
                    value={moment(new Date(timeSpanUser.instantMax))}
                    minDateTime={moment(new Date(timeSpanUser.instantMin))}
                    maxDateTime={moment(new Date(timeSpanData.instantMax))}
                    onChange={handleDateUserMaxChanged}
                />
                <IconButton
                    disabled={(timeSpanUser.instantMin - timeSpanData.instantMin) < TimeUtil.MILLISECONDS_PER____DAY}
                    aria-label='24 hours back'
                    title='24 hours back'
                    size="large"
                    onClick={() => handleDateUserMove(-TimeUtil.MILLISECONDS_PER____DAY)}
                    sx={{ width: '54px', height: '54px' }}
                >
                    <UndoIcon />
                </IconButton>
                <IconButton
                    disabled={(timeSpanData.instantMax - timeSpanUser.instantMax) < TimeUtil.MILLISECONDS_PER____DAY}
                    aria-label='24 hours forward'
                    title='24 hours forward'
                    size="large"
                    onClick={() => handleDateUserMove(TimeUtil.MILLISECONDS_PER____DAY)}
                    sx={{ width: '54px', height: '54px' }}
                >
                    <RedoIcon />
                </IconButton>
            </div>
            <Tabs
                value={activeTabName}
                onChange={(e, v) => setActiveTabName(v as SPAN_TYPE)}
                sx={{ padding: '0px', margin: '0px', minHeight: 'unset!important', position: 'relative', top: '8px' }}
            >
                {Object.keys(TAB_DEFS).map(k => (
                    <Tab
                        value={k}
                        label={TAB_DEFS[k as SPAN_TYPE]}
                        sx={{ padding: '0px', margin: '0px', minHeight: '30px', borderWidth: '5px' }}
                    />
                ))}
            </Tabs>
            <DividerComponent style={{ position: 'relative', top: '-1px' }} title={activeTabName === 'display' ? 'display' : 'markers'} />
            {
                formSpans.length > 0 ? <div style={{ display: 'inline-block' }}>
                    {
                        formSpans.map((value, index) => (
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'unset' }} key={value.uuid}>
                                <MarkSpanComponent
                                    markSpan={value}
                                    handleMarkSpanTitleChanged={handleMarkSpanTitleChanged}
                                    handleMarkSpanMinChanged={handleMarkSpanMinChanged}
                                    handleMarkSpanMaxChanged={handleMarkSpanMaxChanged}
                                    handleMarkSpanDaysChanged={handleMarkSpanDaysChanged}
                                />
                                <IconButton
                                    aria-label='delete chart marker'
                                    title='delete chart marker'
                                    size="large"
                                    onClick={e => handleMarkSpanDelete(value.uuid)}
                                    sx={{ width: '54px', height: '54px' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))
                    }
                    {
                        timeSpans.length > 0 ? <>
                            <DividerComponent title='create new' />
                        </> : null
                    }
                </div> : null
            }


            <div
                onMouseOver={() => setTimeSpanNewOpacity('1.0')}
                onMouseOut={() => setTimeSpanNewOpacity('0.5')}
                style={{ transition: 'opacity 250ms ease-in-out', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', opacity: timeSpanNewOpacity }}
                key={markSpanNew.uuid}
            >
                <MarkSpanComponent
                    markSpan={markSpanNew}
                    handleMarkSpanTitleChanged={handleMarkSpanTitleChanged}
                    handleMarkSpanMinChanged={handleMarkSpanMinChanged}
                    handleMarkSpanMaxChanged={handleMarkSpanMaxChanged}
                    handleMarkSpanDaysChanged={handleMarkSpanDaysChanged}
                />
                <IconButton
                    aria-label='create chart marker'
                    title='create chart marker'
                    size="large"
                    onClick={handleMarkSpanAdd}
                    sx={{ width: '54px', height: '54px' }}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
            </div>


            <DividerComponent title='chart options' />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <TextField
                    label="title"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={formTitle}
                    onChange={e => handleChartTitleUpdate(e.target.value)}
                />
                <FormControl
                    sx={{ width: '106px!important' }}
                >
                    <InputLabel id="demo-simple-select-autowidth-label">line width</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={chartOptions.strokeWidth}
                        onChange={e => handleChartOptionsUpdate({
                            strokeWidth: e.target.value as number
                        })}
                        autoWidth
                        label="stroke width"
                        sx={{ width: '106px!important' }}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ width: '106px!important' }}
                >
                    <InputLabel id="demo-simple-select-autowidth-label">font size</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={chartOptions.fontSize}
                        onChange={e => handleChartOptionsUpdate({
                            fontSize: e.target.value as number
                        })}
                        autoWidth
                        label="font size"
                        sx={{ width: '106px!important' }}
                    >
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={28}>28</MenuItem>
                        <MenuItem value={32}>32</MenuItem>
                    </Select>
                </FormControl>
                <IconButton
                    aria-label={chartOptions.showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    title={chartOptions.showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showGradientFill: !chartOptions.showGradientFill
                    })}
                >
                    <Avatar
                        sx={{ width: 30, height: 30, bgcolor: chartOptions.showGradientFill ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <GradientIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
                <IconButton
                    aria-label={chartOptions.showGradientStroke ? 'mono color stroke' : 'color gradient stroke'}
                    title={chartOptions.showGradientStroke ? 'mono color stroke' : 'color gradient stroke'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showGradientStroke: !chartOptions.showGradientStroke
                    })}
                >
                    <Avatar
                        sx={{ width: 30, height: 30, bgcolor: chartOptions.showGradientStroke ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <ShowChartIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
            </div>
        </LocalizationProvider >
    );

}

export default StepComponentRange;