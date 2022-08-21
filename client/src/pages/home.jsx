import React from 'react';

import { HomeWeekDisplay } from 'components';
import { Container } from '@mui/material';

export default function HomePage() {
	return (
		<Container className='relative' maxWidth='xl'>
			<HomeWeekDisplay />
		</Container>
	);
}
