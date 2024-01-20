import DeleteIcon from '@mui/icons-material/Delete';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { IconButton } from '@mui/material';
import moment from 'moment';
import 'moment/locale/de';
import { useEffect, useState } from 'react';
import DividerComponent from './DividerComponent';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed, PATT_TYPE, SPAN_TYPE } from './IUiProps';
import TimeSpanComponent from './TimeSpanComponent';
import { ObjectUtil } from '../util/ObjectUtil';
import { TimeUtil } from '../util/TimeUtil';

let timeSpanUpdateTimeout = -1;

export interface ITimeSpanListProperties {
    spanType: SPAN_TYPE,
    timeSpans: ITimeSpanNamed[];
    handleTimeSpanUpdate: (timeSpan: ITimeSpanNamed) => void;
}

const TimeSpanListComponent = (props: ITimeSpanListProperties) => {

    const { spanType, timeSpans, handleTimeSpanUpdate } = { ...props };

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

    const nextPattType = (patt: PATT_TYPE): PATT_TYPE => {
        if (patt === 'FW') {
            return 'BW';
        } else if (patt === 'BW') {
            return 'HL';
        } else {
            return 'FW';
        }
    }

    const [formSpans, setFormSpans] = useState<ITimeSpanNamed[]>(timeSpans);

    const [timeSpanNewOpacity, setTimeSpanNewOpacity] = useState<string>('0.5');
    const [timeSpanNew, setTimeSpanNew] = useState<ITimeSpanNamed>({
        uuid: ObjectUtil.createId(),
        title: '',
        instantMin: TimeUtil.toTimeOnlyDate(),
        instantMax: TimeUtil.toTimeOnlyDate(),
        days: [
            ...DAYS_OF_WEEK
        ],
        spanType: 'display',
        pattType: 'HL'
    });

    useEffect(() => {

        console.debug(`⚙ updating time span list component (spanType, timeSpanse)`, spanType, timeSpans);

        if (spanType === 'display' || spanType === 'markers') {
            setTimeSpanNew({
                uuid: ObjectUtil.createId(),
                title: '',
                instantMin: TimeUtil.toTimeOnlyDate(),
                instantMax: TimeUtil.toTimeOnlyDate(),
                days: [
                    ...DAYS_OF_WEEK
                ],
                spanType,
                pattType: spanType === 'display' ? 'HL' : 'FW'
            });
            setFormSpans(timeSpans.filter(s => s.spanType === spanType));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spanType, timeSpans]);



    return (

        <>
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
                        formSpans.length > 0 ? <>
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
        </>

    );

}

export default TimeSpanListComponent;