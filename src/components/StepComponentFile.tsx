import styled from "@emotion/styled";
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Snackbar, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { DatePicker } from "@mui/x-date-pickers";
import moment from 'moment';
import { forwardRef, useEffect, useState } from "react";
import { FileRejection, useDropzone } from 'react-dropzone';
import { FileParser } from "../data/FileParser";
import { TimeUtil } from "../util/TimeUtil";
import DividerComponent from "./DividerComponent";
import { IDataProps } from "./IUiProps";
import StepComponentChartOverview from "./StepComponentChartOverview";
import { ThemeUtil } from "../util/ThemeUtil";

const getColor = (props: any) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#cccccc';
}

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #999999;
    outline: none;
    transition: border .24s ease-in-out;
  `;

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StepComponentFile = (props: IDataProps) => {

    const { timeSpanData, timeSpanUser, records, handleTimeSpanUserUpdate, handleRecordUpdate } = { ...props };

    const [errorDisplay, setErrorDisplay] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const accept: { [K: string]: [] } = {}
    FileParser.INSTANCE.getAcceptableMimeTypes().forEach(m => accept[m] = []);
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept,
        onDrop: files => acceptFile(files[files.length - 1]),
        onDropRejected: files => rejctFile(files[files.length - 1]),
    });

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

    useEffect(() => {

        console.debug(`⚙ updating ranges component (timeSpanData, timeSpanUser)`, timeSpanData, timeSpanUser);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeSpanData, timeSpanUser]);

    useEffect(() => {
        console.debug('✨ building file picker component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rejctFile = (rejection: FileRejection) => {
        console.warn('rejection', rejection);
        setErrorMessage(`file was rejected`);
        setErrorDisplay(true);
    }

    const acceptFile = (file: File) => {

        // @ts-ignore
        if (!file) {
            console.warn('no file');
            return;
        }

        FileParser.INSTANCE.parseFile(file).then(records => {
            handleRecordUpdate({
                ...records,
                name: file.name
            });
        }).catch(e => {
            console.warn(e);
            setErrorMessage(e.message);
            setErrorDisplay(true);
        });

    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorDisplay(false);
    };

    return (
        <>
            <Snackbar open={errorDisplay} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component={'div'}>
                    <div>Please start by exporting CSV or XLSX data from your CO₂ device to a location of your choice. Then import the CSV or XLSX file here using the button below.</div>
                    <div>
                        <br />
                        Currently there is support for:
                        <ul>
                            <li>Aranet CSV.</li>
                            <li>Inkbird CSV (experimental).</li>
                            <li>Smartair (qingping) XLSX (experimental).</li>
                        </ul>
                    </div>
                </Typography>
            </div>
            <DividerComponent title={'dropzone'} />
            <div className="container">
                <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    <p>drop CSV or XLSX file here, or click to select files</p>
                </Container>
            </div>
            {
                records.length > 0 ? <>
                    <DividerComponent borderWidth={'2px'} />
                    <Typography>Below you find an overview of the data imported. You can use the date fields provided to limit the range of data included in the chart.</Typography>
                    <DividerComponent title={'name/type'} />
                    {
                        props.name ? <span style={{ fontSize: '0.8rem' }}>{props.name}, ({props.type})</span> : null
                    }
                    <DividerComponent title={'data range'} />
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
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
                            disabled={timeSpanUser.instantMin <= timeSpanData.instantMin}
                            aria-label='1 day back'
                            title='1 day back'
                            size="large"
                            onClick={() => handleDateUserMove(-TimeUtil.MILLISECONDS_PER____DAY)}
                            sx={{ width: '54px', height: '54px' }}
                        >
                            <UndoIcon />
                        </IconButton>
                        <IconButton
                            disabled={timeSpanUser.instantMax >= timeSpanData.instantMax}
                            aria-label='1 day forward'
                            title='1 day forward'
                            size="large"
                            onClick={() => handleDateUserMove(TimeUtil.MILLISECONDS_PER____DAY)}
                            sx={{ width: '54px', height: '54px' }}
                        >
                            <RedoIcon />
                        </IconButton>
                    </div>
                    {
                        props.records.length > 0 ? <StepComponentChartOverview{...props} /> : null
                    }
                </> : null
            }

        </>
    );

}

export default StepComponentFile;