import { Theme, createTheme } from "@mui/material";

export class ThemeUtil {

    static COLOR_ACCORDION_BG = '#dddddd';
    static COLOR_CHART_FONT = '#000000';
    static COLOR_CHART_BG = '#ffffff';
    static COLOR_PRIMARY = '#1976d2';
    static COLOR_SECONDARY = '#aaaaaa';

    static getTheme(): Theme {

        return createTheme({

            palette: {
                mode: 'light',
                secondary: {
                    main: '#aaaaaa',
                    light: '#aaaaaa',
                }
            },
            components: {

                MuiAccordionSummary: {
                    styleOverrides: {
                        root: {
                            '&.Mui-expanded': {
                                minHeight: '48px'
                            }
                        }
                    }
                },
                MuiCollapse: {
                    styleOverrides: {
                        wrapperInner: {

                        }
                    }
                },
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
                            height: '36px',
                            margin: '8px 0px',
                        }
                    }
                },
                MuiFormControl: {
                    styleOverrides: {
                        root: {
                            height: '36px',
                            margin: '8px 8px 8px 0px!important',
                        }
                    }
                }

            }
        });

    }

}