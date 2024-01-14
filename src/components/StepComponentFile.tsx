import styled from "@emotion/styled";
import IosShareIcon from '@mui/icons-material/IosShare';
import { Snackbar, Typography } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { AranetUtil } from "../util/AranetUtil";
import DividerComponent from "./DividerComponent";
import { IUiProps } from "./IUiProps";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

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

const StepComponentFile = (props: IUiProps) => {

    const { handleRecordUpdate } = { ...props };

    const [errorDisplay, setErrorDisplay] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: { 'text/csv': [] },
        onDrop: files => acceptFile(files[files.length - 1])
    });

    useEffect(() => {
        console.debug('✨ building file picker component');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const acceptFile = (file: File) => {

        // @ts-ignore
        // var file = e.target.files[0];
        if (!file) {
            console.warn('no file');
            return;
        }

        var reader = new FileReader();
        reader.onload = e => {

            // @ts-ignore
            const text = e.target.result as string;
            try {
                const records = AranetUtil.parseFile(text);
                handleRecordUpdate(file.name, records);
            } catch (e: any) {
                console.error('failed to load csv file', e);
                setErrorMessage(e.message);
                setErrorDisplay(true);
            }
        }
        reader.readAsText(file);

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
            <DividerComponent />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography>
                    <span>Please start by exporting CSV data from your Aranet4 device. Find and press the export icon </span>
                    <span><IosShareIcon sx={{ width: '24px', height: '24px', paddingTop: '6px' }} /></span>
                    <span> in your Aranet App. Export the CSV file to a location of your choice, then import the CSV file here using the button below.</span>
                </Typography>
            </div>
            <DividerComponent />
            <div className="container">
                <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    <p>drop CSV file here, or click to select files</p>
                </Container>
            </div>
        </>
    );

}

export default StepComponentFile;