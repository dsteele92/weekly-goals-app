import React, { useState } from 'react';
import axios from 'axios';
import Style from './addNewGoal.module.scss';

import { ListAllGoals } from 'components';

export default function AddNewGoal() {
	const [nameInput, setNameInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');
	const [customCategoryInput, setCustomCategoryInput] = useState('');
	const [timesPerWeek, setTimesPerWeek] = useState(0);

	const [customCategory, setCustomCategory] = useState(false);

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

	async function addGoal(e) {
		e.preventDefault();
		try {
			for (let i = 0; i < timesPerWeek; i++) {
				const category = customCategory === true ? customCategoryInput : categoryInput;
				await axios.post(`http://localhost:10000/goals?name=${nameInput}&category=${category}`);
				console.log(`NEW GOAL CREATED ${timesPerWeek} times`);
				setNameInput('');
				setCategoryInput('--Select--');
				setTimesPerWeek(0);
				setCustomCategory(false);
				setCustomCategoryInput('');
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div>
			<div className={Style.container}>
				<h4>Add New Goal</h4>
				<form className={Style.form}>
					<div>
						<label htmlFor='goal'>Goal</label>
						<input
							type='text'
							name='goal'
							id='goal'
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
							value={timesPerWeek}
							onChange={(e) => setTimesPerWeek(e.target.value)}
						/>
					</div>
					<button onClick={addGoal}>Submit</button>
				</form>
			</div>
			<ListAllGoals />
		</div>
	);
}
