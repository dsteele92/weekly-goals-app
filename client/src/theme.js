import { createTheme } from '@mui/material/styles';

// --> theme colors for Material UI Components
const theme = createTheme({
	palette: {
		primary: {
			main: '#6c6c6c',
		},
		light: {
			main: '#cacaca',
		},

		secondary: {
			main: '#9FBCE7',
		},
		warning: {
			main: '#d64a1f',
		},
	},
});

export default theme;
