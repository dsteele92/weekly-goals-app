import React, { useState } from 'react';
import axios from 'axios';
import Style from './homeWeekDisplay.module.scss';
import { CircularProgressBar } from 'components';

import { Checkbox, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function HomeWeekDisplay() {
	const [goalsList, setGoalsList] = useState([]);
	const [categories, setCategories] = useState([]);
	const [resetConfirmation, setResetConfirmation] = useState(false);

	let currentCategories = [];

	async function getGoals() {
		try {
			const categoryRequest = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			const goalsData = goals.data;
			const categoriesData = categoryRequest.data;
			console.log(goalsData);
			console.log(categoriesData);

			// --> create an array of the current category names
			goalsData.forEach((goal) => {
				if (!currentCategories.includes(goal.category)) {
					console.log(goal.category);

					currentCategories.push(goal.category);
				}
			});
			console.log(currentCategories);
			// --> filter all categories for the current ones
			const filtered = categoriesData.filter((cat) => currentCategories.includes(cat.name));

			setCategories(filtered);
			setGoalsList(goalsData);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the component
	if (goalsList.length === 0 && categories.length === 0) {
		getGoals();
	}

	let loaded = false;
	if (goalsList.length > 0 && categories.length > 0) {
		loaded = true;
	}

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
					copy.completed = checked;
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
		<div>
			{goalsList.length === 0 ? (
				<div className={Style.modalBackground}>
					<div className={Style.modal}>
						<h2>Add new goals to get started!</h2>
					</div>
				</div>
			) : (
				''
			)}
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
			{loaded ? (
				<div className={Style.page}>
					<section className={Style.progressSection}>
						<h2 className={Style.progressHeader}>Weekly Progress</h2>
						{categories.map((cat) => (
							<div key={cat._id}>
								<CircularProgressBar
									goals={goalsList.filter((goal) => goal.category === cat.name)}
									category={cat}
								/>
							</div>
						))}
					</section>
					<section className={Style.homeWeekDisplay}>
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
															categories.filter(
																(cat) =>
																	cat.name.toLowerCase() ===
																	goal.category.toLowerCase()
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
					</section>
				</div>
			) : (
				''
			)}
		</div>
	);
}
