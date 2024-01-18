import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GradientIcon from '@mui/icons-material/Gradient';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import RedoIcon from '@mui/icons-material/Redo';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import UndoIcon from '@mui/icons-material/Undo';
import { Avatar, FormControl, IconButton, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/de';
import { useEffect, useState } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';
import { ThemeUtil } from '../util/ThemeUtil';
import { TimeUtil } from '../util/TimeUtil';
import DividerComponent from './DividerComponent';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed, IUiProps, PATT_TYPE, SPAN_TYPE } from './IUiProps';
import TimeSpanComponent from './TimeSpanComponent';

let timeSpanUpdateTimeout = -1;
let chartTitleUpdateTimeout = -1;

export const TAB_DEFS: { [K in SPAN_TYPE]: string } = {
    display: 'DISPLAY',
    markers: 'MARKERS'
};

const StepComponentRange = (props: IUiProps) => {

    const { timeSpanData, timeSpanUser, timeSpans, chartOptions, handleTimeSpanUserUpdate, handleTimeSpanUpdate, handleChartOptionsUpdate } = { ...props };

    const [activeTabName, setActiveTabName] = useState<SPAN_TYPE>('display');

    const [timeSpanNewOpacity, setTimeSpanNewOpacity] = useState<string>('0.5');

    const [formSpans, setFormSpans] = useState<ITimeSpanNamed[]>(timeSpans);
    const [formTitle, setFormTitle] = useState<string>(chartOptions.title);

    const [timeSpanNew, setTimeSpanNew] = useState<ITimeSpanNamed>({
        uuid: ObjectUtil.createId(),
        title: '',
        instantMin: TimeUtil.toTimeOnlyDate(),
        instantMax: TimeUtil.toTimeOnlyDate(),
        days: [
            ...DAYS_OF_WEEK
        ],
        spanType: activeTabName,
        pattType: activeTabName === 'display' ? 'HL' : 'BW'
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
                instantMin: TimeUtil.toInstantMinUser(value.unix() * 1000)
            })
        }
    }

    const handleDateUserMaxChanged = (value: moment.Moment | null) => {
        if (value) {
            handleTimeSpanUserUpdate({
                ...timeSpanUser,
                instantMax: TimeUtil.toInstantMaxUser(value.unix() * 1000)
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

    const handleTimeSpanMinChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            const instantMin = value.hours() * 3600000 + value.minutes() * 60000;
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
                    instantMin
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        instantMin
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleTimeSpanMaxChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            const instantMax = value.hours() * 3600000 + value.minutes() * 60000;
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
                    instantMax
                });
            } else {
                const formSpan = formSpans.find(t => t.uuid === uuid);
                if (formSpan) {
                    const _formSpan: ITimeSpanNamed = {
                        ...formSpan,
                        instantMax
                    };
                    handleFormSpanUpdate(_formSpan);
                }
            }
        }
    }

    const handleTimeSpanTitleChanged = (uuid: string, title: string) => {
        if (title) {
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
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

    const handleTimeSpanDaysChanged = (uuid: string, days: DAY_OF_WEEK[]) => {
        if (days) {
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
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

    const handleTimeSpanPattToggle = (uuid: string) => {
        if (uuid === timeSpanNew.uuid) {
            setTimeSpanNew({
                ...timeSpanNew,
                pattType: nextPattType(timeSpanNew.pattType)
            });
        } else {
            const formSpan = formSpans.find(t => t.uuid === uuid);
            if (formSpan) {
                const _formSpan: ITimeSpanNamed = {
                    ...formSpan,
                    pattType: nextPattType(formSpan.pattType)
                };
                handleFormSpanUpdate(_formSpan);
            }
        }
    }

    const nextPattType = (patt: PATT_TYPE): PATT_TYPE => {
        if (patt === 'FW') {
            return 'BW';
        } else if (patt === 'BW') {
            return 'HL';
        } else {
            return 'FW';
        }
    }

    const handleFormSpanUpdate = (_formSpan: ITimeSpanNamed) => {

        const _formSpans = formSpans.filter(t => t.uuid !== _formSpan.uuid);
        _formSpans.push(_formSpan);
        _formSpans.sort((a, b) => a.instantMin - b.instantMin);
        setFormSpans(_formSpans);

        window.clearTimeout(timeSpanUpdateTimeout);
        timeSpanUpdateTimeout = window.setTimeout(() => {
            handleTimeSpanUpdate(_formSpan);
        }, 500);

    }

    const handleFormSpanAdd = () => {
        handleTimeSpanUpdate(timeSpanNew);
    }

    const handleFormSpanDelete = (uuid: string) => {
        const _formSpan = timeSpans.find(t => t.uuid === uuid);
        if (_formSpan) {
            handleTimeSpanUpdate({
                ..._formSpan,
                instantMin: Number.NEGATIVE_INFINITY,
                instantMax: Number.NEGATIVE_INFINITY,
            });
        }
    }

    useEffect(() => {
        console.debug('✨ building ranges component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpans, chartOptions, activeTabName)`, timeSpans, chartOptions, activeTabName);

        setTimeSpanNew({
            uuid: ObjectUtil.createId(),
            title: '',
            instantMin: TimeUtil.toTimeOnlyDate(),
            instantMax: TimeUtil.toTimeOnlyDate(),
            days: [
                ...DAYS_OF_WEEK
            ],
            spanType: activeTabName,
            pattType: activeTabName === 'display' ? 'HL' : 'FW'
        });
        setFormSpans(timeSpans.filter(s => s.spanType === activeTabName));
        setFormTitle(chartOptions.title);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpans, chartOptions, activeTabName]);

    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpanData, timeSpanUser)`, timeSpanData, timeSpanUser);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanData, timeSpanUser]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DividerComponent />
            <Typography sx={{ paddingRight: '10px', marginBottom: '6px' }}>You can now specify the displayed date/time range with the 'min (incl)' and 'max (incl)' date pickers, then further limit the data to be included by adding display ranges. It is also possible to create marker ranges, i.e. to indicate a daily timetable.</Typography>
            <DividerComponent title='chart display range' />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: '46px' }}>
                <DatePicker
                    sx={{ margin: '6px', width: '220px' }}
                    label="min (incl)"
                    value={moment(new Date(timeSpanUser.instantMin))}
                    minDate={moment(new Date(timeSpanData.instantMin))}
                    maxDate={moment(new Date(timeSpanUser.instantMax))}
                    onChange={handleDateUserMinChanged}
                />
                <DatePicker
                    sx={{ margin: '6px', width: '220px' }}
                    label="max (incl)"
                    value={moment(new Date(timeSpanUser.instantMax))}
                    minDate={moment(new Date(timeSpanUser.instantMin))}
                    maxDate={moment(new Date(timeSpanData.instantMax))}
                    onChange={handleDateUserMaxChanged}
                />
                <IconButton
                    disabled={(timeSpanUser.instantMin - timeSpanData.instantMin) < TimeUtil.MILLISECONDS_PER____DAY}
                    aria-label='1 day back'
                    title='1 day back'
                    size="large"
                    onClick={() => handleDateUserMove(-TimeUtil.MILLISECONDS_PER____DAY)}
                    sx={{ width: '54px', height: '54px' }}
                >
                    <UndoIcon />
                </IconButton>
                <IconButton
                    disabled={(timeSpanData.instantMax - timeSpanUser.instantMax) < TimeUtil.MILLISECONDS_PER____DAY}
                    aria-label='1 day forward'
                    title='1 day forward'
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
                        key={k}
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
                                <TimeSpanComponent
                                    timeSpan={value}
                                    handleTimeSpanTitleChanged={handleTimeSpanTitleChanged}
                                    handleTimeSpanMinChanged={handleTimeSpanMinChanged}
                                    handleTimeSpanMaxChanged={handleTimeSpanMaxChanged}
                                    handleTimeSpanDaysChanged={handleTimeSpanDaysChanged}
                                    handleTimeSpanPattToggle={handleTimeSpanPattToggle}
                                />
                                <IconButton
                                    aria-label='delete chart marker'
                                    title='delete chart marker'
                                    size="large"
                                    onClick={e => handleFormSpanDelete(value.uuid)}
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
                key={timeSpanNew.uuid}
            >
                <TimeSpanComponent
                    timeSpan={timeSpanNew}
                    handleTimeSpanTitleChanged={handleTimeSpanTitleChanged}
                    handleTimeSpanMinChanged={handleTimeSpanMinChanged}
                    handleTimeSpanMaxChanged={handleTimeSpanMaxChanged}
                    handleTimeSpanDaysChanged={handleTimeSpanDaysChanged}
                    handleTimeSpanPattToggle={handleTimeSpanPattToggle}
                />
                <IconButton
                    aria-label='create chart marker'
                    title='create chart marker'
                    size="large"
                    onClick={handleFormSpanAdd}
                    sx={{ width: '54px', height: '54px' }}
                >
                    <MoreTimeIcon />
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
                    sx={{ margin: '6px', width: '220px' }}
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
                    aria-label={chartOptions.showDates ? 'hide dates' : 'show dates'}
                    title={chartOptions.showDates ? 'hide dates' : 'show dates'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showDates: !chartOptions.showDates
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: chartOptions.showDates ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <EventAvailableIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <FormControl
                    sx={{ width: '106px!important' }}
                >
                    <InputLabel id="demo-simple-select-autowidth-label">green</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        onChange={e => handleChartOptionsUpdate({
                            minColorVal: e.target.value as number
                        })}
                        autoWidth
                        label="green"
                        sx={{ width: '106px!important' }}
                        value={chartOptions.minColorVal}
                    >
                        {
                            [400, 500, 600, 700, 800, 900, 1000].map(value => <MenuItem value={value}>{`${value}ppm`}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ width: '106px!important' }}
                >
                    <InputLabel id="demo-simple-select-autowidth-label">steps</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={chartOptions.stpColorVal}
                        onChange={e => handleChartOptionsUpdate({
                            stpColorVal: e.target.value as number
                        })}
                        autoWidth
                        label="steps"
                        sx={{ width: '106px!important' }}
                    >
                        {
                            [2, 3, 4, 5, 6, 8, 10].map(value => <MenuItem value={value}>{`${value}`}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ width: '106px!important' }}
                >
                    <InputLabel id="demo-simple-select-autowidth-label">red</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        onChange={e => handleChartOptionsUpdate({
                            maxColorVal: e.target.value as number
                        })}
                        autoWidth
                        label="red"
                        sx={{ width: '106px!important' }}
                        value={chartOptions.maxColorVal}
                    >
                        {
                            [1000, 1100, 1200, 1300, 1400, 1500, 1600].map(value => <MenuItem value={value}>{`${value}ppm`}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <IconButton
                    disabled={!chartOptions.showGradientFill && !chartOptions.showGradientStroke}
                    aria-label={chartOptions.showLegend ? 'hide legend' : 'show legend'}
                    title={chartOptions.showLegend ? 'hide legend' : 'show legend'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showLegend: !chartOptions.showLegend
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: chartOptions.showLegend && (chartOptions.showGradientFill || chartOptions.showGradientStroke) ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <MoreHorizIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
                <IconButton
                    aria-label={chartOptions.showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    title={chartOptions.showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showGradientFill: !chartOptions.showGradientFill
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: chartOptions.showGradientFill ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
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
                        sx={{ width: 33, height: 30, bgcolor: chartOptions.showGradientStroke ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <ShowChartIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
            </div>
        </LocalizationProvider >
    );

}

export default StepComponentRange;