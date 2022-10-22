import React, { useState } from 'react';
import axios from 'axios';
import Style from './updateGoal.module.scss';
import * as backend from '../../../backendURL.js';

import { FormControl, TextField, Select, InputLabel, MenuItem, Button, Checkbox } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function UpdateGoal(props) {
	const isCustom = !(
		props.category === 'Fitness' ||
		props.category === 'Nutrition' ||
		props.category === 'Mindfulness'
	);

	const [nameInput, setNameInput] = useState(props.name);
	const [categoryInput, setCategoryInput] = useState(isCustom ? 'Custom' : props.category);
	const [customCategoryInput, setCustomCategoryInput] = useState(isCustom ? props.category : '');
	const [customCategory, setCustomCategory] = useState(isCustom);
	const [timesPerWeek, setTimesPerWeek] = useState(props.timesPerWeek);
	const [deletingGoals, setDeletingGoals] = useState(false);
	const [idsToDelete, setIdsToDelete] = useState([]);

	const categories = [...props.categories.map((cat) => cat.name), 'Custom'];

	async function updateGoal() {
		const goalsToUpdate = props.goals.filter((goal) => goal.name === props.name);
		let idsToUpdate = goalsToUpdate.map((goal) => goal._id);
		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		try {
			let requests = [];
			for (let i in idsToUpdate) {
				const id = idsToUpdate[i];
				const request = axios({
					method: 'put',
					url: `${backend.url}/goals/${id}`,
					data: data,
				});
				requests.push(request);
			}
			if (customCategory) {
				if (!props.allCategories.includes(customCategoryInput)) {
					const categoryUpdate = axios({
						method: 'post',
						url: `${backend.url}/category`,
						data: { name: `${customCategoryInput}`, color: 0 },
					});
					requests.push(categoryUpdate);
				}
			}
			await Promise.all(requests);
			console.log(`GOAL UPDATED`);
			props.rerenderList();
			props.unmount();
		} catch (e) {
			console.log(e);
		}
	}

	async function updateAmount() {
		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		if (timesPerWeek > props.timesPerWeek) {
			const difference = timesPerWeek - props.timesPerWeek;
			try {
				let requests = [];
				for (let i = 0; i < difference; i++) {
					const request = axios({
						method: 'post',
						url: `${backend.url}/goals`,
						data: data,
					});
					requests.push(request);
				}
				await Promise.all(requests);
				props.rerenderList();
				props.unmount();
			} catch (e) {
				console.log(e);
			}
			console.log('greater than');
		} else if (timesPerWeek < props.timesPerWeek) {
			console.log(props.goals);
			setDeletingGoals(true);
			// select which ones to delete
			// -----------------------------------------------!
		} else {
			props.rerenderList();
			props.unmount();
		}
	}

	function onCategoryChange(e) {
		setCategoryInput(e.target.value);
		e.target.value === 'Custom' ? setCustomCategory(true) : setCustomCategory(false);
		console.log(e.target.value);
	}

	function handleCheckbox(e, id) {
		console.log('checky');
		console.log(id);
		console.log(e);
		let newIds = Array.from(idsToDelete);
		if (e.target.checked) {
			newIds.push(id);
			setIdsToDelete(newIds);
		} else {
			const index = newIds.indexOf(id);
			newIds.splice(index, 1);
			setIdsToDelete(newIds);
		}
		console.log(newIds);
	}

	async function removeSelected() {
		console.log('Okay');
		let requests = [];
		idsToDelete.forEach((id) => {
			const request = axios.delete(`${backend.url}/goals/${id}`);
			requests.push(request);
		});
		await Promise.all(requests);
		props.rerenderList();
		props.unmount();
	}

	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<div className={Style.exitButton} onClick={props.unmount}>
					X
				</div>
				<ThemeProvider theme={theme}>
					{!deletingGoals ? (
						<div className={Style.updateForms}>
							<section>
								<h2 className={Style.updateH2}>Update Goal</h2>
								<FormControl margin='dense'>
									{/* <form className={Style.addForm}> */}
									<TextField
										margin='dense'
										color='secondary'
										id='goal'
										variant='outlined'
										label='Enter Goal'
										value={nameInput}
										onChange={(e) => setNameInput(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												updateGoal();
											}
										}}
									/>
									<FormControl fullWidth margin='dense'>
										<InputLabel id='category'>Select a Category</InputLabel>
										<Select
											color='secondary'
											labelId='category'
											id='category'
											variant='outlined'
											label='Select a Category'
											value={categoryInput}
											onChange={onCategoryChange}>
											{categories.map((option) => (
												<MenuItem key={option} value={option}>
													{option}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									{customCategory === true ? (
										<TextField
											margin='dense'
											color='secondary'
											id='category'
											variant='outlined'
											label='Enter Custom Category'
											value={customCategoryInput}
											onChange={(e) => setCustomCategoryInput(e.target.value)}
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
													updateGoal();
												}
											}}
										/>
									) : (
										''
									)}
								</FormControl>
								<Button className={Style.buttonsMUI} variant='outlined' onClick={updateGoal}>
									Submit
								</Button>
							</section>
							<section>
								<h2 className={Style.updateH2}>Update Amount</h2>
								<FormControl margin='dense'>
									<TextField
										margin='dense'
										color='secondary'
										id='timesPerWeek'
										variant='outlined'
										label='Times Per Week'
										type='number'
										value={timesPerWeek}
										onChange={(e) => setTimesPerWeek(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												updateAmount();
											}
										}}
									/>
								</FormControl>
								<Button variant='outlined' onClick={updateAmount}>
									Submit
								</Button>
							</section>
						</div>
					) : (
						''
					)}
					{deletingGoals ? (
						<div className={Style.deletingGoals}>
							<h2>Which would you like to remove?</h2>
							<div className={Style.deletingGoalsList}>
								{props.goals
									.filter((goal) => goal.name === props.name)
									.map((goal) => (
										<div key={goal._id} className={Style.deletingGoalsItem}>
											<h3>{goal.name}</h3>
											<p>{goal.day}</p>
											<Checkbox
												inputProps={{ 'aria-label': 'Delete Y/N?' }}
												color='warning'
												onChange={(e) => handleCheckbox(e, goal._id)}
											/>
										</div>
									))}
							</div>
							<div className={Style.buttons}>
								<Button
									className={Style.buttonsMUI}
									variant='outlined'
									onClick={() => setDeletingGoals(false)}>
									Back
								</Button>
								<Button
									className={Style.buttonsMUI}
									color='warning'
									variant='contained'
									onClick={removeSelected}>
									Delete
								</Button>
							</div>
						</div>
					) : (
						''
					)}
				</ThemeProvider>
			</div>
		</div>
	);
}
