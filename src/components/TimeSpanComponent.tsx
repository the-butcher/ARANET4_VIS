import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/de';
import { TimeUtil } from '../util/TimeUtil';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed } from './IUiProps';

export interface ITimeSpanProperties {
    timeSpan: ITimeSpanNamed;
    handleTimeSpanTitleChanged: (uuid: string, title: string) => void;
    handleTimeSpanMinChanged: (uuid: string, value: moment.Moment | null) => void;
    handleTimeSpanMaxChanged: (uuid: string, value: moment.Moment | null) => void;
    handleTimeSpanDaysChanged: (uuid: string, days: DAY_OF_WEEK[]) => void;
}

const TimeSpanComponent = (props: ITimeSpanProperties) => {

    const { timeSpan, handleTimeSpanTitleChanged, handleTimeSpanMinChanged, handleTimeSpanMaxChanged, handleTimeSpanDaysChanged } = { ...props };

    return (

        <>
            <TextField
                label="title"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={timeSpan.title}
                onChange={e => handleTimeSpanTitleChanged(timeSpan.uuid, e.target.value)}
                sx={{ width: '220px!important' }}
            />
            <TimePicker
                label="min"
                value={moment(TimeUtil.toLocalInstant(timeSpan.instantMin))}
                maxTime={moment(TimeUtil.toLocalInstant(timeSpan.instantMax))}
                onChange={e => handleTimeSpanMinChanged(timeSpan.uuid, e)}
                sx={{ width: '106px!important' }}
            />
            <TimePicker
                label="max"
                value={moment(TimeUtil.toLocalInstant(timeSpan.instantMax))}
                minTime={moment(TimeUtil.toLocalInstant(timeSpan.instantMin))}
                onChange={e => handleTimeSpanMaxChanged(timeSpan.uuid, e)}
                sx={{ width: '106px!important' }}
            />
            <FormControl
                sx={{ width: '106px!important' }}
            >
                <InputLabel id="demo-multiple-checkbox-label">days</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={timeSpan.days}
                    onChange={e => handleTimeSpanDaysChanged(timeSpan.uuid, e.target.value as DAY_OF_WEEK[])}
                    input={<OutlinedInput label="days" />}
                    renderValue={(selected) => timeSpan.days.join(', ')}
                    sx={{ width: '106px!important' }}
                >
                    {DAYS_OF_WEEK.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            sx={{ padding: '0px' }}
                        >
                            <Checkbox checked={timeSpan.days.indexOf(name) !== -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>

    );

}

export default TimeSpanComponent;