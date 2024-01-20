import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GradientIcon from '@mui/icons-material/Gradient';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Avatar, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import 'moment/locale/de';
import { ThemeUtil } from '../util/ThemeUtil';
import { IChartOptions } from './IUiProps';
import { useState } from 'react';

let chartTitleUpdateTimeout = -1;

const ChartOptionsComponent = (props: IChartOptions) => {

    const { title, fontSize, strokeWidth, showDates, minColorVal, stpColorVal, maxColorVal, showGradientFill, showGradientStroke, showLegend, handleChartOptionsUpdate } = { ...props };

    const [formTitle, setFormTitle] = useState<string>(title);

    const handleChartTitleUpdate = (title: string) => {
        setFormTitle(title);
        window.clearTimeout(chartTitleUpdateTimeout);
        chartTitleUpdateTimeout = window.setTimeout(() => {
            handleChartOptionsUpdate({
                title
            })
        }, 500);
    }

    return (
        <>
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
                        value={strokeWidth}
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
                        value={fontSize}
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
                    aria-label={showDates ? 'hide dates' : 'show dates'}
                    title={showDates ? 'hide dates' : 'show dates'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showDates: !showDates
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: showDates ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
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
                        value={minColorVal}
                    >
                        {
                            [400, 500, 600, 700, 800, 900, 1000].map(value => <MenuItem key={`green_${value}`} value={value}>{`${value}ppm`}</MenuItem>)
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
                        value={stpColorVal}
                        onChange={e => handleChartOptionsUpdate({
                            stpColorVal: e.target.value as number
                        })}
                        autoWidth
                        label="steps"
                        sx={{ width: '106px!important' }}
                    >
                        {
                            [2, 3, 4, 5, 6, 8, 10].map(value => <MenuItem key={`steps_${value}`} value={value}>{`${value}`}</MenuItem>)
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
                        value={maxColorVal}
                    >
                        {
                            [1000, 1100, 1200, 1300, 1400, 1500, 1600].map(value => <MenuItem key={`red_${value}`} value={value}>{`${value}ppm`}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <IconButton
                    disabled={!showGradientFill && !showGradientStroke}
                    aria-label={showLegend ? 'hide legend' : 'show legend'}
                    title={showLegend ? 'hide legend' : 'show legend'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showLegend: !showLegend
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: showLegend && (showGradientFill || showGradientStroke) ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <MoreHorizIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
                <IconButton
                    aria-label={showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    title={showGradientFill ? 'hide chart gradient' : 'show chart gradient'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showGradientFill: !showGradientFill
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: showGradientFill ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <GradientIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
                <IconButton
                    aria-label={showGradientStroke ? 'mono color stroke' : 'color gradient stroke'}
                    title={showGradientStroke ? 'mono color stroke' : 'color gradient stroke'}
                    size="large"
                    onClick={e => handleChartOptionsUpdate({
                        showGradientStroke: !showGradientStroke
                    })}
                >
                    <Avatar
                        sx={{ width: 33, height: 30, bgcolor: showGradientStroke ? ThemeUtil.COLOR_PRIMARY : ThemeUtil.COLOR_SECONDARY }}
                    >
                        <ShowChartIcon sx={{ width: 20, height: 20 }} />
                    </Avatar>
                </IconButton>
            </div>
        </>
    );

}

export default ChartOptionsComponent;