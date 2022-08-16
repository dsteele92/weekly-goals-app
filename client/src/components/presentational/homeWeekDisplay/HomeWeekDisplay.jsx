import React, { useState } from 'react';
import axios from 'axios';
import Style from './homeWeekDisplay.module.scss';
import { Modal } from 'components';

import { Checkbox, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function HomeWeekDisplay() {
	const [goalsList, setGoalsList] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [resetConfirmation, setResetConfirmation] = useState(false);

	async function getGoals() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			console.log(goals.data);
			console.log(categories.data);

			setAllCategories(categories.data);
			setGoalsList(goals.data);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the component
	if (goalsList.length === 0 && allCategories.length === 0) {
		getGoals();
	}

	// this will be used to make sure that all of the data has been loaded
	// before returning the page content... returning the child components without the data causes an error

	const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	async function handleCheckbox(e, id) {
		const checked = e.target.checked;
		const data = { completed: checked };
		const response = await axios({
			method: 'put',
			url: `http://localhost:10000/goals/${id}`,
			data: data,
		});
		if (response.status === 200) {
			let arrayCopy = JSON.parse(JSON.stringify(goalsList));
			const updated = arrayCopy.map((goal) => {
				if (goal._id === id) {
					let copy = JSON.parse(JSON.stringify(goal));
					console.log(copy);
					copy.completed = checked;
					console.log(copy);
					return copy;
				} else {
					return goal;
				}
			});
			setGoalsList(updated);
		}
	}

	async function reset() {
		let requests = [];
		goalsList.forEach((goal) => {
			const request = axios({
				method: 'put',
				url: `http://localhost:10000/goals/${goal._id}`,
				data: { completed: false },
			});
			requests.push(request);
		});
		await Promise.all(requests);
		getGoals();
		setResetConfirmation(false);
	}

	return (
		<div className={Style.page}>
			{goalsList.length === 0 ? <Modal text='Add new goals to get started!' /> : ''}
			{resetConfirmation ? (
				<div className={Style.modalBackground}>
					<div className={Style.modal}>
						<h2>Reset all?</h2>
						<ThemeProvider theme={theme}>
							<div className={Style.buttons}>
								<Button
									className={Style.buttonsMUI}
									variant='outlined'
									onClick={() => setResetConfirmation(false)}>
									Cancel
								</Button>
								<Button
									className={Style.buttonsMUI}
									variant='contained'
									color='warning'
									onClick={reset}>
									Reset
								</Button>
							</div>
						</ThemeProvider>
					</div>
				</div>
			) : (
				''
			)}
			<div className={Style.homeWeekDisplay}>
				<div className={Style.clearAll}>
					<ThemeProvider theme={theme}>
						<Button variant='outlined' size='small' onClick={() => setResetConfirmation(true)}>
							Reset
						</Button>
					</ThemeProvider>
				</div>
				{weekdays.map((day, index) => (
					<div key={index} className={Style.day}>
						<ul>
							<h2 className={Style.header}>{day}</h2>
							{goalsList
								.filter((goal) => goal.day === day)
								.sort((a, b) => a.dayIndex - b.dayIndex)
								.map((goal, index) => (
									<li
										key={index}
										className={
											Style[
												`goal${
													allCategories.filter(
														(cat) => cat.name.toLowerCase() === goal.category.toLowerCase()
													)[0].color
												}`
											]
										}>
										{goal.name}
										<ThemeProvider theme={theme}>
											<Checkbox
												inputProps={{ 'aria-label': 'Complete? Y/N' }}
												color='light'
												onChange={(e) => handleCheckbox(e, goal._id)}
												checked={goal.completed}
											/>
										</ThemeProvider>
									</li>
								))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
