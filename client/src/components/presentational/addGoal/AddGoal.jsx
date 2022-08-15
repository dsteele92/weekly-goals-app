import React, { useState } from 'react';
import axios from 'axios';
import Style from './addGoal.module.scss';

import { FormValidationModal } from 'components';
import { FormControl, TextField, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function AddGoal(props) {
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

	const categories = [...props.categories.map((cat) => cat.name), 'Custom'];

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

		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		try {
			let requests = [];
			for (let i = 0; i < timesPerWeek; i++) {
				const request = await axios({
					method: 'post',
					url: 'http://localhost:10000/goals',
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
						url: 'http://localhost:10000/category',
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
	}

	return (
		<div className={Style.addGoal}>
			<h2 className={Style.header}>Add New Goal</h2>
			<ThemeProvider theme={theme}>
				<FormControl fullWidth margin='dense'>
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
