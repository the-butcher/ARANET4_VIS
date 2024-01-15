import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/de';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed } from './IUiProps';

export interface IMarkSpanProperties {
    markSpan: ITimeSpanNamed;
    handleMarkSpanTitleChanged: (uuid: string, title: string) => void;
    handleMarkSpanMinChanged: (uuid: string, value: moment.Moment | null) => void;
    handleMarkSpanMaxChanged: (uuid: string, value: moment.Moment | null) => void;
    handleMarkSpanDaysChanged: (uuid: string, days: DAY_OF_WEEK[]) => void;
}

const MarkSpanComponent = (props: IMarkSpanProperties) => {

    const { markSpan, handleMarkSpanTitleChanged, handleMarkSpanMinChanged, handleMarkSpanMaxChanged, handleMarkSpanDaysChanged } = { ...props };

    return (

        <>
            <TextField
                label="title"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={markSpan.title}
                onChange={e => handleMarkSpanTitleChanged(markSpan.uuid, e.target.value)}
                sx={{ width: '220px!important' }}
            />
            <TimePicker
                label="min"
                value={moment(markSpan.instantMin)}
                maxTime={moment(markSpan.instantMax)}
                onChange={e => handleMarkSpanMinChanged(markSpan.uuid, e)}
                sx={{ width: '106px!important' }}
            />
            <TimePicker
                label="max"
                value={moment(markSpan.instantMax)}
                minTime={moment(markSpan.instantMin)}
                onChange={e => handleMarkSpanMaxChanged(markSpan.uuid, e)}
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
                    value={markSpan.days}
                    onChange={e => handleMarkSpanDaysChanged(markSpan.uuid, e.target.value as DAY_OF_WEEK[])}
                    input={<OutlinedInput label="days" />}
                    renderValue={(selected) => markSpan.days.join(', ')}
                    sx={{ width: '106px!important' }}
                >
                    {DAYS_OF_WEEK.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            sx={{ padding: '0px' }}
                        >
                            <Checkbox checked={markSpan.days.indexOf(name) !== -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>

    );

}

export default MarkSpanComponent;