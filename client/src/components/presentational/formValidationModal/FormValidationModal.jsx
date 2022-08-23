import React from 'react';
import Style from './formValidationModal.module.scss';
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function FormValidationModal(props) {
	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h2>Enter a goal and a category to submit</h2>
				<div className={Style.buttons}>
					<ThemeProvider theme={theme}>
						<Button variant='outlined' onClick={props.unmount}>
							Okay
						</Button>
					</ThemeProvider>
				</div>
			</div>
		</div>
	);
}
