import { Divider, Typography } from "@mui/material";

export interface IDividerProps {
    title?: string
    style?: React.CSSProperties;
}

const DividerComponent = (props: IDividerProps) => {

    const { title, style } = { ...props };

    return (
        <div style={style}>
            <div style={{ height: title ? '0px' : '6px' }} />
            {
                title ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Divider sx={{ flexGrow: '10' }} />
                    <Typography sx={{ padding: '0px 6px', fontSize: '0.70rem!important' }}>{title}</Typography>
                    <Divider sx={{ minWidth: '12px' }} />
                </div> : <Divider />
            }
            <div style={{ height: title ? '0px' : '10px' }} />
        </div>
    );

}

export default DividerComponent;