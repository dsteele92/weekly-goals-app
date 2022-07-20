import React from 'react';
import { Container } from '@mui/material';
import { AddNewGoal, ListAllGoals, EditGoals } from 'components';

export default function EditPage() {
	return (
		<Container maxWidth='xl'>
			<EditGoals />
		</Container>
	);
}
