import { createTheme } from '@mui/material/styles';

// --> theme colors for Material UI Components
const theme = createTheme({
	palette: {
		primary: {
			main: '#6c6c6c',
		},
		light: {
			main: '#ababab',
		},

		secondary: {
			main: '#5c8fdb',
		},
		warning: {
			main: '#d64a1f',
		},
	},
});

export default theme;
