import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import GradientIcon from '@mui/icons-material/Gradient';
import RedoIcon from '@mui/icons-material/Redo';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import UndoIcon from '@mui/icons-material/Undo';
import { Avatar, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/de';
import { useEffect, useState } from 'react';
import { ObjectUtil } from '../util/ObjectUtil';
import { ThemeUtil } from '../util/ThemeUtil';
import { TimeUtil } from '../util/TimeUtil';
import DividerComponent from './DividerComponent';
import { ITimeSpanNamed, IUiProps } from './IUiProps';

let timeSpanUpdateTimeout = -1;
let chartTitleUpdateTimeout = -1;

const StepComponentRange = (props: IUiProps) => {

    const { timeSpanData, timeSpanUser, timeSpans, chartOptions, handleTimeSpanUserUpdate, handleTimeSpanUpdate, handleChartOptionsUpdate } = { ...props };

    const [timeSpanNewOpacity, setTimeSpanNewOpacity] = useState<string>('0.5');

    const [formSpans, setFormSpans] = useState<ITimeSpanNamed[]>(timeSpans);
    const [formTitle, setFormTitle] = useState<string>(chartOptions.title);

    const [timeSpanNew, setTimeSpanNew] = useState<ITimeSpanNamed>({
        uuid: ObjectUtil.createId(),
        title: '',
        instantMin: TimeUtil.toTimeOnlyDate(),
        instantMax: TimeUtil.toTimeOnlyDate()
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

    const handleTimeSpanMinChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
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

    const handleTimeSpanMaxChanged = (uuid: string, value: moment.Moment | null) => {
        if (value) {
            if (uuid === timeSpanNew.uuid) {
                setTimeSpanNew({
                    ...timeSpanNew,
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

    const handleTimeSpanAdd = () => {
        handleTimeSpanUpdate(timeSpanNew);
    }

    const handleTimeSpanDelete = (uuid: string) => {
        const timeSpan = timeSpans.find(t => t.uuid === uuid);
        if (timeSpan) {
            handleTimeSpanUpdate({
                ...timeSpan,
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

        console.debug(`⚙ updating ranges component (timeSpans)`, timeSpans);

        setTimeSpanNew({
            uuid: ObjectUtil.createId(),
            title: '',
            instantMin: TimeUtil.toTimeOnlyDate(),
            instantMax: TimeUtil.toTimeOnlyDate()
        });
        setFormSpans(timeSpans);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpans]);

    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpanData, timeSpanUser)`, timeSpanData, timeSpanUser);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanData, timeSpanUser]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DividerComponent />
            <div style={{ display: 'flex' }}>
                <Typography sx={{ paddingRight: '10px', marginBottom: '6px' }}>You can now specify the displayed date/time range with the 'min' and 'max' date pickers. It is also possible to create chart markers, i.e. to indicate a daily timetable.</Typography>
            </div>
            <DividerComponent title='chart display range' />
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <DateTimePicker sx={{ margin: '6px', width: '250px' }}
                        label="min"
                        value={moment(new Date(timeSpanUser.instantMin))}
                        minDateTime={moment(new Date(timeSpanData.instantMin))}
                        maxDateTime={moment(new Date(timeSpanUser.instantMax))}
                        onChange={handleDateUserMinChanged}
                    />
                    <DateTimePicker sx={{ margin: '6px', width: '250px' }}
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
                {
                    timeSpans.length > 0 ? <>
                        <DividerComponent title='chart markers' />
                    </> : null
                }
                {
                    formSpans.map((value, index) => (
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} key={value.uuid}>
                            <TextField
                                label="title"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={value.title}
                                onChange={e => handleTimeSpanTitleChanged(value.uuid, e.target.value)}
                            />
                            <TimePicker
                                label="min"
                                value={moment(value.instantMin)}
                                maxTime={moment(value.instantMax)}
                                onChange={e => handleTimeSpanMinChanged(value.uuid, e)}
                            />
                            <TimePicker
                                label="max"
                                value={moment(value.instantMax)}
                                minTime={moment(value.instantMin)}
                                onChange={e => handleTimeSpanMaxChanged(value.uuid, e)}
                            />
                            <IconButton
                                aria-label='delete chart marker'
                                title='delete chart marker'
                                size="large"
                                onClick={e => handleTimeSpanDelete(value.uuid)}
                                sx={{ width: '54px', height: '54px' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))
                }
                <DividerComponent title='create chart marker' />
                <div
                    onMouseOver={() => setTimeSpanNewOpacity('1.0')}
                    onMouseOut={() => setTimeSpanNewOpacity('0.5')}
                    style={{ transition: 'opacity 250ms ease-in-out', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', opacity: timeSpanNewOpacity }}
                    key={timeSpanNew.uuid}
                >
                    <TextField
                        label="title"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={timeSpanNew.title}
                        onChange={e => handleTimeSpanTitleChanged(timeSpanNew.uuid, e.target.value)}
                    />
                    <TimePicker
                        label="min"
                        value={moment(timeSpanNew.instantMin)}
                        maxTime={moment(timeSpanNew.instantMax)}
                        onChange={e => handleTimeSpanMinChanged(timeSpanNew.uuid, e)}
                    />
                    <TimePicker
                        label="max"
                        value={moment(timeSpanNew.instantMax)}
                        minTime={moment(timeSpanNew.instantMin)}
                        onChange={e => handleTimeSpanMaxChanged(timeSpanNew.uuid, e)}
                    />
                    <IconButton
                        aria-label='create chart marker'
                        title='create chart marker'
                        size="large"
                        onClick={handleTimeSpanAdd}
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
            </div>
        </LocalizationProvider>
    );

}

export default StepComponentRange;