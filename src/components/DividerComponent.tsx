import { Divider, Typography } from "@mui/material";

export interface IDividerProps {
    title?: string
    style?: React.CSSProperties;
    borderWidth?: string;
}

const DividerComponent = (props: IDividerProps) => {

    const { title, style, borderWidth } = { ...props };

    return (
        <div style={style}>
            <div style={{ height: title ? '0px' : '6px' }} />
            {
                title ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {
                        borderWidth ? <Divider sx={{ flexGrow: '10', borderWidth: borderWidth }} /> : <Divider sx={{ flexGrow: '10' }} />
                    }
                    <Typography sx={{ padding: '0px 6px', fontSize: '0.70rem!important' }}>{title}</Typography>
                    {
                        borderWidth ? <Divider sx={{ minWidth: '12px', borderWidth: borderWidth }} /> : <Divider sx={{ minWidth: '12px' }} />
                    }

                </div> : <Divider sx={{ borderWidth: borderWidth ? borderWidth : 0 }} />
            }
            <div style={{ height: title ? '0px' : '10px' }} />
        </div>
    );

}

export default DividerComponent;