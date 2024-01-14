import { Theme, createTheme } from "@mui/material";

export class ThemeUtil {

    static COLOR_ACCORDION_BG = '#dddddd';
    static COLOR_CHART_FONT = '#000000';
    static COLOR_CHART_BG = '#ffffff';
    static COLOR_PRIMARY = '#1976d2';
    static COLOR_SECONDARY = '#cccccc';

    static getTheme(): Theme {

        return createTheme({

            palette: {
                mode: 'light',
                secondary: {
                    main: '#cccccc',
                    light: '#cccccc',
                }
            },
            components: {

                MuiTypography: {
                    styleOverrides: {
                        root: {
                            fontFamily: 'Courier Prime Sans',
                            fontSize: '14px!important'
                        }
                    }
                },
                MuiInputBase: {
                    styleOverrides: {
                        root: {
                            fontFamily: 'Courier Prime Sans!important',
                            fontSize: '14px!important',
                            width: '220px',
                            margin: '0px',
                            height: '36px'
                        }
                    }
                },
                MuiButtonBase: {
                    styleOverrides: {
                        root: {
                            fontFamily: 'Courier Prime Sans!important',
                            fontSize: '14px!important'
                        }
                    }
                },
                MuiFormLabel: {
                    styleOverrides: {
                        root: {
                            fontFamily: 'Courier Prime Sans!important',
                            fontSize: '14px!important'
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            width: '220px',
                            height: '36px',
                            margin: '8px 0px',
                        }
                    }
                },
                MuiFormControl: {
                    styleOverrides: {
                        root: {
                            width: '220px!important',
                            height: '36px',
                            margin: '8px 8px 8px 0px!important',
                        }
                    }
                }

            }
        });

    }

}