import React from 'react';

// import { SetUp } from 'components';
import { Schedule } from 'components';
import { Container } from '@mui/material';

export default function SchedulePage() {
	return (
		<Container maxWidth='xl'>
			<h1>Schedule Page</h1>
			<Schedule />
		</Container>
	);
}
