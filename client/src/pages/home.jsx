import React from 'react';

import { HomeWeekDisplay } from 'components';
import { Container } from '@mui/material';

export default function HomePage() {
	return (
		<Container maxWidth='xl'>
			<HomeWeekDisplay />
		</Container>
	);
}
