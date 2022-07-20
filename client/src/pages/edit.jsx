import React from 'react';
import { Container } from '@mui/material';
import { AddNewGoal, ListAllGoals } from 'components';

export default function EditPage() {
	return (
		<Container maxWidth='xl'>
			<AddNewGoal />
			<ListAllGoals category='Fitness' />
			<ListAllGoals category='Nutrition' />
			<ListAllGoals category='Mindfulness' />
		</Container>
	);
}
