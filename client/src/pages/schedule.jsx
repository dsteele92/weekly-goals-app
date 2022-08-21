import React from 'react';

// import { SetUp } from 'components';
import { Scheduler } from 'components';
import { Container } from '@mui/material';

export default function SchedulePage() {
	return (
		<Container className='relative' maxWidth='xl'>
			<Scheduler />
		</Container>
	);
}
