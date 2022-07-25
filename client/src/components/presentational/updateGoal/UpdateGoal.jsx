import React, { useState } from 'react';
import axios from 'axios';
import Style from './updateGoal.module.scss';

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

	async function update(e) {
		e.preventDefault();
		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		try {
			const responses = [];
			const ids = props.ids;
			for (const id in ids) {
				const response = axios({
					method: 'put',
					url: `http://localhost:10000/goals/${ids[id]}`,
					data: data,
				});
				responses.push(response);
			}
			await Promise.all(responses);
			console.log(`GOAL UPDATED`);
			props.unmount();
			// setNameInput('');
			// setCategoryInput('--Select--');
			// setCustomCategory(false);
			// setCustomCategoryInput('');
		} catch (e) {
			console.log(e);
		}
	}

	function onCategoryChange(e) {
		setCategoryInput(e.target.value);
		e.target.value === 'Custom' ? setCustomCategory(true) : setCustomCategory(false);
		console.log(e.target.value);
	}

	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h4>Update Goal</h4>
				<div className={Style.exitButton} onClick={props.unmount}>
					X
				</div>
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
					{/* <div>
						<label htmlFor='times'>Times per week</label>
						<input
							type='number'
							id='times'
							value={timesPerWeek}
							onChange={(e) => setTimesPerWeek(e.target.value)}
						/>
					</div> */}
					<button onClick={update}>Submit</button>
				</form>
			</div>
		</div>
	);
}
