import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PROFILE_DEFS } from '../App';
import { StorageUtil } from '../util/StorageUtil';
import { ThemeUtil } from '../util/ThemeUtil';
import { IProfileProps } from './IProfileProps';
import { IDataProps, IUiProps } from './IUiProps';
import StepComponentChartDetail from './StepComponentChartDetail';
import StepComponentFile from './StepComponentFile';
import StepComponentRange from './StepComponentRange';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import StepComponentChartSankey from './StepComponentChartSankey';

const PANEL_ID___FILE = 'panel_id___file';
const PANEL_ID_RANGES = 'panel_id_ranges';

const UiComponent = (props: IUiProps & IDataProps & IProfileProps) => {

    const { profileId, handleProfileIdUpdate } = { ...props };

    const [panelIds, setPanelIds] = useState<string[]>([
        PANEL_ID___FILE,
        PANEL_ID_RANGES
    ]);

    const togglePanelId = (panelId: string) => {
        if (panelIds.indexOf(panelId) === -1) {
            setPanelIds([
                ...panelIds,
                panelId
            ]);
        } else {
            setPanelIds(panelIds.filter(p => p !== panelId));
        }
    }

    const handleProfileChange = (event: React.SyntheticEvent, _profileId: number) => {
        event.stopPropagation();
        handleProfileIdUpdate(_profileId);
    }

    useEffect(() => {
        console.debug('✨ building ui component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '0px', padding: '12px' }}>
                <Accordion elevation={4} expanded={panelIds.indexOf(PANEL_ID___FILE) >= 0} onChange={() => togglePanelId(PANEL_ID___FILE)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{ backgroundColor: ThemeUtil.COLOR_ACCORDION_BG, height: '42px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: '10', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography>
                                CO₂ SENSOR DATA
                            </Typography>
                            {/* {
                                props.name ? <span style={{ fontSize: '0.8rem' }}> :: {props.name}, ({props.type})</span> : null
                            } */}
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack>
                            <StepComponentFile {...props} />
                        </Stack>
                    </AccordionDetails>
                </Accordion>
                <Accordion elevation={4} expanded={panelIds.indexOf(PANEL_ID_RANGES) >= 0} onChange={() => togglePanelId(PANEL_ID_RANGES)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        sx={{ backgroundColor: ThemeUtil.COLOR_ACCORDION_BG, height: '42px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: '10', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                CHART CONFIGURATION
                            </Typography>
                            <div style={{ width: '50px' }}></div>
                            <Tabs
                                value={profileId}
                                onChange={handleProfileChange}
                                aria-label="icon tabs example"
                                sx={{ padding: '0px', margin: '0px', minHeight: 'unset!important' }}

                            > {
                                    PROFILE_DEFS.map((value, index) =>
                                        <Tab
                                            key={`PROFILE_${index}`}
                                            // label={`${index}`}
                                            aria-label={`PROFILE ${index}`}
                                            sx={{ padding: '0px', margin: '0px', minWidth: '70px!important' }}
                                            icon={StorageUtil.hasProps(value.sProp) ? value.icon1 : value.icon0}
                                        />
                                    )
                                }
                            </Tabs>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <StepComponentRange {...props} />
                    </AccordionDetails>
                </Accordion>
                <div style={{ height: '20px' }}></div>
                {
                    props.records.length > 0 ? <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'column' }}><StepComponentChartDetail {...props} /></Paper> : null
                }
                <div style={{ height: '20px' }}></div>
                <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '11px 0px' }}>
                    <a href="https://twitter.com/FleischerHannes" target='_blank' rel="noreferrer" style={{ margin: '11px 22px', whiteSpace: 'nowrap' }}>@FleischerHannes</a>
                    <a href="https://github.com/the-butcher/ARANET4_VIS" target='_blank' rel="noreferrer" style={{ margin: '11px 22px', whiteSpace: 'nowrap' }}>https://github.com/the-butcher/ARANET4_VIS (instructions here)</a>
                </Paper>
            </Box>

        </LocalizationProvider >

    );

}

export default UiComponent;