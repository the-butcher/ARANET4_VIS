import { Avatar, Checkbox, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/de';
import { TimeUtil } from '../util/TimeUtil';
import { DAYS_OF_WEEK, DAY_OF_WEEK, ITimeSpanNamed } from './IUiProps';
import TextureIcon from '@mui/icons-material/Texture';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { ThemeUtil } from '../util/ThemeUtil';

export interface ITimeSpanProperties {
    timeSpan: ITimeSpanNamed;
    handleTimeSpanTitleChanged: (uuid: string, title: string) => void;
    handleTimeSpanMinChanged: (uuid: string, value: moment.Moment | null) => void;
    handleTimeSpanMaxChanged: (uuid: string, value: moment.Moment | null) => void;
    handleTimeSpanDaysChanged: (uuid: string, days: DAY_OF_WEEK[]) => void;
    handleTimeSpanPattToggle: (uuid: string) => void;
}

const TimeSpanComponent = (props: ITimeSpanProperties) => {

    const { timeSpan, handleTimeSpanTitleChanged, handleTimeSpanMinChanged, handleTimeSpanMaxChanged, handleTimeSpanDaysChanged, handleTimeSpanPattToggle } = { ...props };

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
            <IconButton
                aria-label={'toggle pattern type'}
                title={'toggle pattern type'}
                size="large"
                onClick={e => handleTimeSpanPattToggle(timeSpan.uuid)}
            >
                <Avatar
                    sx={{ width: 33, height: 30, bgcolor: true ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                >
                    {
                        timeSpan.pattType === 'HL' ? <CropSquareIcon sx={{ width: 20, height: 20 }} /> : <TextureIcon sx={{ width: 20, height: 20, rotate: timeSpan.pattType === 'BW' ? '90deg' : '0deg' }} />
                    }

                </Avatar>
            </IconButton>
        </>

    );

}

export default TimeSpanComponent;