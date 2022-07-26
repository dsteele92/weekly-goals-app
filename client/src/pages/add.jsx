import React from 'react';
import { ListAllGoals } from 'components';
import { Container } from '@mui/material';

export default function AddPage() {
	return (
		<Container maxWidth='xl'>
			<ListAllGoals />
		</Container>
	);
}
