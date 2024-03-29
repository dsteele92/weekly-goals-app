import React, { useState } from 'react';
import axios from 'axios';
import Style from './addGoal.module.scss';
import * as backend from '../../../backendURL.js';

import { FormValidationModal, LoadingDots } from 'components';
import { FormControl, TextField, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function AddGoal(props) {
	const [loading, setLoading] = useState(false);
	const [nameInput, setNameInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');
	const [customCategory, setCustomCategory] = useState(false);
	const [customCategoryInput, setCustomCategoryInput] = useState('');
	const [timesPerWeek, setTimesPerWeek] = useState('');
	const [formValidationModal, setFormValidationModal] = useState(false);

	/* if "Custom" option is selected from drop down:
	---> change customCategory state to true
	---> show div with text input (Enter Custom Category)
	---> check state when adding category to post request:
	const category = customCategory === true ? customCategoryInput : categoryInput;
	*/

	const standardCategories = ['Fitness', 'Nutrition', 'Mindfulness'];
	const customCategoryEntries = props.categories
		.filter((cat) => !standardCategories.includes(cat.name))
		.map((cat) => cat.name);
	const categories = [...standardCategories, ...customCategoryEntries, 'Custom'];

	function onCategoryChange(e) {
		setCategoryInput(e.target.value);
		e.target.value === 'Custom' ? setCustomCategory(true) : setCustomCategory(false);
		console.log(e.target.value);
	}

	function handleUnmount() {
		setFormValidationModal(false);
	}

	async function addGoal(e) {
		// e.preventDefault();

		// form validation
		if (
			nameInput.length === 0 ||
			categoryInput.length === 0 ||
			(customCategory && customCategoryInput.length === 0)
		) {
			setFormValidationModal(true);
			return;
		}

		setLoading(true);

		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		try {
			let requests = [];
			for (let i = 0; i < timesPerWeek; i++) {
				const request = await axios({
					method: 'post',
					url: `${backend.url}/goals`,
					data: data,
				});
				requests.push(request);
			}
			if (customCategory) {
				if (
					!props.allCategories
						.map((cat) => cat.name.toLowerCase())
						.includes(customCategoryInput.toLowerCase())
				) {
					console.log(props.allCategories);
					const request = await axios({
						method: 'post',
						url: `${backend.url}/category`,
						data: { name: `${customCategoryInput}`, color: 0 },
					});
					requests.push(request);
				}
			}
			Promise.all(requests);
			setNameInput('');
			setCategoryInput('--Select--');
			setTimesPerWeek('');
			setCustomCategory(false);
			setCustomCategoryInput('');
			props.rerenderList();
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
	}

	return (
		<div className={Style.addGoal}>
			{loading && (
				<div className={Style.modalBackground}>
					<div className={Style.modal}>
						<LoadingDots />
					</div>
				</div>
			)}
			<h2 className={Style.header}>Add New Goal</h2>
			<ThemeProvider theme={theme}>
				<FormControl fullWidth margin='dense'>
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
								addGoal();
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
							{categories.map((option, index) => (
								<MenuItem key={index} value={option}>
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
									addGoal();
								}
							}}
						/>
					) : (
						''
					)}
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
								addGoal();
							}
						}}
					/>
				</FormControl>
				<Button variant='outlined' fullWidth onClick={addGoal}>
					Submit
				</Button>
			</ThemeProvider>

			{formValidationModal ? <FormValidationModal unmount={handleUnmount} /> : ''}
		</div>
	);
}
