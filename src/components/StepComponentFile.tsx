import styled from "@emotion/styled";
import { Snackbar, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { forwardRef, useEffect, useState } from "react";
import { FileRejection, useDropzone } from 'react-dropzone';
import { FileParser } from "../data/FileParser";
import DividerComponent from "./DividerComponent";
import { IUiProps } from "./IUiProps";

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
            <DividerComponent />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component={'div'}>
                    <div>Please start by exporting CSV or XlSX data from your CO₂ device to a location of your choice. Then import the CSV or XLSX file here using the button below.</div>
                    <div>
                        <br />
                        Currently there is support for:
                        <ul>
                            <li>Aranet CSV.</li>
                            <li>Inkbird CSV (experimental).</li>
                            <li>Smartair (qingping) XSLX (experimental).</li>
                        </ul>
                    </div>
                </Typography>
            </div>
            <DividerComponent />
            <div className="container">
                <Container {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    <p>drop CSV or XSLX file here, or click to select files</p>
                </Container>
            </div>
        </>
    );

}

export default StepComponentFile;