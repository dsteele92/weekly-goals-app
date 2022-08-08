import React, { useState } from 'react';
import axios from 'axios';
import Style from './addGoal.module.scss';

import { FormValidationModal } from 'components';

export default function AddGoal(props) {
	const [nameInput, setNameInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');
	const [customCategory, setCustomCategory] = useState(false);
	const [customCategoryInput, setCustomCategoryInput] = useState('');
	const [timesPerWeek, setTimesPerWeek] = useState(1);
	const [formValidationModal, setFormValidationModal] = useState(false);

	/* if "Custom" option is selected from drop down:
	---> change customCategory state to true
	---> show div with text input (Enter Custom Category)
	---> check state when adding category to post request:
	const category = customCategory === true ? customCategoryInput : categoryInput;
	*/

	function onCategoryChange(e) {
		setCategoryInput(e.target.value);
		e.target.value === 'Custom' ? setCustomCategory(true) : setCustomCategory(false);
		console.log(e.target.value);
	}

	function handleUnmount() {
		setFormValidationModal(false);
	}

	async function addGoal(e) {
		e.preventDefault();

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
			setTimesPerWeek(1);
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
			<form className={Style.form}>
				<div>
					<label htmlFor='goal'>Goal</label>
					<input
						type='text'
						name='goal'
						id='goal'
						maxLength='24'
						value={nameInput}
						onChange={(e) => setNameInput(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor='category'>Category</label>
					<select name='category' id='category' value={categoryInput} onChange={onCategoryChange}>
						<option value=''>--Select--</option>
						<option value='Fitness'>Fitness</option>
						<option value='Nutrition'>Nutrition</option>
						<option value='Mindfulness'>Mindfulness</option>
						{props.categories
							.filter((cat) => !cat === 'Fitness' || !cat === 'Nutrition' || !cat === 'Mindfulness')
							.map((cat, index) => (
								<option key={index} value={cat}>
									{cat}
								</option>
							))}
						<option value='Custom'>Custom</option>
					</select>
				</div>
				{customCategory === true ? (
					<div className={Style.customCategory}>
						<input
							type='text'
							name='category'
							id='category'
							placeholder='Enter Custom Category'
							maxLength='24'
							value={customCategoryInput}
							onChange={(e) => setCustomCategoryInput(e.target.value)}
						/>
					</div>
				) : (
					''
				)}
				<div>
					<label htmlFor='times'>Times per week</label>
					<input
						type='number'
						id='times'
						min='1'
						value={timesPerWeek}
						onChange={(e) => setTimesPerWeek(e.target.value)}
					/>
				</div>
				<button onClick={addGoal}>Submit</button>
			</form>
			{formValidationModal ? <FormValidationModal unmount={handleUnmount} /> : ''}
		</div>
	);
}
