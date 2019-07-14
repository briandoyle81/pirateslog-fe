// src/ui/theme/index.js

import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
    primary: { main: '#374949', contrastText: '#FDD835' },
    secondary: { main: '#E00707', contrastText: '#E00707' },
    error: { main: '#E00707' },
    background: { 
        paper: '#fff',
        default: '#fff'
        },
    typography: {
        h6: {
            fontFamily: "Pirata One"
        }
    },
};
const themeName = 'Thunderbird';

export default createMuiTheme({ palette, themeName });