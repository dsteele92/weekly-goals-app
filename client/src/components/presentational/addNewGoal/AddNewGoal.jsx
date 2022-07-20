import React, { useState } from 'react';
import axios from 'axios';
import Style from './addNewGoal.module.scss';
import { Button } from 'components';

export default function AddNewGoal() {
	const [nameInput, setNameInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');
	const [timesPerWeek, setTimesPerWeek] = useState(0);

	async function addGoal(e) {
		e.preventDefault();
		try {
			for (let i = 0; i < timesPerWeek; i++) {
				await axios.post(`http://localhost:10000/goals?name=${nameInput}&category=${categoryInput}`);
				console.log(`NEW GOAL CREATED ${timesPerWeek} times`);
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className={Style.Container}>
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
					<select
						name='category'
						id='category'
						value={categoryInput}
						onChange={(e) => setCategoryInput(e.target.value)}>
						<option value=''>--Select--</option>
						<option value='Fitness'>Fitness</option>
						<option value='Nutrition'>Nutrition</option>
						<option value='Mindfulness'>Mindfulness</option>
					</select>
				</div>
				<div>
					<label htmlFor='times'>Times per week</label>
					<input
						type='number'
						id='times'
						value={timesPerWeek}
						onChange={(e) => setTimesPerWeek(e.target.value)}
					/>
				</div>
				<button onClick={addGoal} className={Style.smallButton}>
					Submit
				</button>
			</form>
		</div>
	);
}
