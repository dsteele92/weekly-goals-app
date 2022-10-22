import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Style from './homeWeekDisplay.module.scss';
import { CircularProgressBar, LoadingDots } from 'components';

import { Checkbox, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';
import * as backend from '../../../backendURL.js';

export default function HomeWeekDisplay() {
	const [goalsList, setGoalsList] = useState([]);
	const [categories, setCategories] = useState([]);
	const [resetConfirmation, setResetConfirmation] = useState(false);
	const [unscheduledGoals, setUnscheduledGoals] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	let currentCategories = [];

	async function getGoals() {
		try {
			const categoryRequest = await axios.get(`${backend.url}/category`);
			const goals = await axios.get(`${backend.url}/goals`);
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

			if (currentCategories.length > 0) {
				// this is so the getGoals function wont run twice
				setCategories(filtered);
			} else {
				setCategories(['loaded']);
			}
			setGoalsList(goalsData);

			goalsData.every((goal) => {
				if (goal.day === 'unassigned') {
					setUnscheduledGoals(true);
					console.log(unscheduledGoals);
					console.log(goal);
					return false;
				} else {
					return true;
				}
			});

			setDataLoaded(true);
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
			url: `${backend.url}/goals/${id}`,
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
				url: `${backend.url}/goals/${goal._id}`,
				data: { completed: false },
			});
			requests.push(request);
		});
		await Promise.all(requests);
		setResetConfirmation(false);
		getGoals();
	}

	return (
		<div>
			<ThemeProvider theme={theme}>
				{!dataLoaded ? (
					<div className={Style.modalBackground}>
						<div className={Style.modal}>
							<LoadingDots />
						</div>
					</div>
				) : (
					''
				)}
				{dataLoaded && goalsList.length === 0 ? (
					<div className={Style.modalBackground}>
						<div className={Style.modal}>
							<h2>Add new goals to get started!</h2>
							<div className={Style.buttons}>
								<Link to='/edit'>
									<Button variant='outlined' color='secondary'>
										Edit Goals
									</Button>
								</Link>
							</div>
						</div>
					</div>
				) : (
					''
				)}
				{dataLoaded && unscheduledGoals && goalsList.length > 0 ? (
					<div className={Style.modalBackground}>
						<div className={Style.modal}>
							<h2>You have unscheduled goals</h2>
							<h4>Assign your goals to days to begin</h4>
							<div className={Style.buttons}>
								<Link to='/schedule'>
									<Button variant='outlined' color='secondary'>
										Schedule
									</Button>
								</Link>
							</div>
						</div>
					</div>
				) : (
					''
				)}
				{resetConfirmation ? (
					<div className={Style.modalBackground}>
						<div className={Style.modal}>
							<h2>Reset all?</h2>
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
						</div>
					</div>
				) : (
					''
				)}
				{loaded ? (
					<div className={Style.page}>
						<section className={Style.progressSection}>
							<h2 className={Style.progressHeader}>Weekly Progress</h2>
							<div className={Style.progressBars}>
								{categories.map((cat) => (
									<div key={cat._id}>
										<CircularProgressBar
											goals={goalsList.filter((goal) => goal.category === cat.name)}
											category={cat}
										/>
									</div>
								))}
							</div>
						</section>
						<section className={Style.homeWeekDisplay}>
							<div className={Style.clearAll}>
								<Button variant='outlined' size='small' onClick={() => setResetConfirmation(true)}>
									Reset
								</Button>
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
													<Checkbox
														inputProps={{ 'aria-label': 'Complete? Y/N' }}
														color='light'
														onChange={(e) => handleCheckbox(e, goal._id)}
														checked={goal.completed}
													/>
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
			</ThemeProvider>
		</div>
	);
}
