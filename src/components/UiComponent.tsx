import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PROFILE_DEFS } from '../App';
import { StorageUtil } from '../util/StorageUtil';
import { ThemeUtil } from '../util/ThemeUtil';
import { TimeUtil } from '../util/TimeUtil';
import { IProfileProps } from './IProfileProps';
import { IUiProps } from './IUiProps';
import StepComponentChart from './StepComponentChart';
import StepComponentFile from './StepComponentFile';
import StepComponentRange from './StepComponentRange';


const PANEL_ID___FILE = 'panel_id___file';
const PANEL_ID_RANGES = 'panel_id_ranges';




const UiComponent = (props: IUiProps & IProfileProps) => {

    const { name, timeSpanUser, timeSpans, profileId, handleProfileIdUpdate } = { ...props };

    const [spanTitle, setSpanTitle] = useState<string>('');

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

    useEffect(() => {
        console.debug(`⚙ updating ui component (name)`, name);
        if (name && name !== '') {
            setPanelIds(panelIds.filter(p => p !== PANEL_ID___FILE)); // close the file accordion after a file change
        } else {
            // no file name => file panel must show
            setPanelIds([
                ...panelIds.filter(p => p !== PANEL_ID___FILE),
                PANEL_ID___FILE
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    useEffect(() => {

        console.debug(`⚙ updating ui component (timeSpans)`, timeSpans);

        if (timeSpanUser.instantMin > 0) {

            const displaySpanCount = props.timeSpans.filter(t => t.spanType === 'display').length;
            const markersSpanCount = props.timeSpans.filter(t => t.spanType === 'markers').length;

            setSpanTitle(` :: ${TimeUtil.formatCategoryDateFull(timeSpanUser.instantMin)} -> ${TimeUtil.formatCategoryDateFull(timeSpanUser.instantMax)}, ${displaySpanCount} display range${displaySpanCount !== 1 ? 's' : ''}, ${markersSpanCount} marker range${markersSpanCount !== 1 ? 's' : ''}`);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpans]);

    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', margin: '0px', padding: '12px' }}>
            <Accordion elevation={4} expanded={panelIds.indexOf(PANEL_ID___FILE) >= 0} onChange={() => togglePanelId(PANEL_ID___FILE)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ backgroundColor: ThemeUtil.COLOR_ACCORDION_BG, height: '42px' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: '10', borderBottom: 1, borderColor: 'divider' }}>
                        <Typography

                        >
                            IMPORT CO₂ SENSOR DATA
                        </Typography>
                        <div style={{ width: '50px' }}></div>
                        <Tabs
                            value={profileId}
                            onChange={handleProfileChange}
                            aria-label="icon tabs example"
                            sx={{ padding: '0px', margin: '0px', minHeight: 'unset!important', flexGrow: '10' }}

                        > {
                                PROFILE_DEFS.map((value, index) =>
                                    <Tab
                                        key={`PROFILE_${index}`}
                                        // label={`${index}`}
                                        aria-label={`PROFILE ${index}`}

                                        sx={{ padding: '0px', margin: '0px' }}
                                        icon={StorageUtil.hasProps(value.sProp) ? value.icon1 : value.icon0}
                                    />
                                )
                            }
                        </Tabs>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        <StepComponentFile {...props} />
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Accordion elevation={4} expanded={panelIds.indexOf(PANEL_ID_RANGES) >= 0 && props.records.length !== 0} disabled={props.records.length === 0} onChange={() => togglePanelId(PANEL_ID_RANGES)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{ backgroundColor: ThemeUtil.COLOR_ACCORDION_BG, height: '42px' }}
                >
                    <Typography>
                        SPECIFY DATA RANGES
                        {
                            props.name ? <span style={{ fontSize: '0.8rem' }}> :: {props.name}, ({props.type})</span> : null
                        }
                        <span style={{ fontSize: '0.8rem' }}>{spanTitle}</span>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <StepComponentRange {...props} />
                </AccordionDetails>
            </Accordion>
            <div style={{ height: '20px' }}></div>
            {
                props.records.length > 0 ? <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'column' }}><StepComponentChart {...props} /></Paper> : null
            }
            <div style={{ height: '20px' }}></div>
            <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '11px 0px' }}>
                <a href="https://twitter.com/FleischerHannes" target='_blank' rel="noreferrer" style={{ margin: '11px 22px', whiteSpace: 'nowrap' }}>@FleischerHannes</a>
                <a href="https://github.com/the-butcher/ARANET4_VIS" target='_blank' rel="noreferrer" style={{ margin: '11px 22px', whiteSpace: 'nowrap' }}>https://github.com/the-butcher/ARANET4_VIS</a>
            </Paper>
        </Box>

    );

}

export default UiComponent;