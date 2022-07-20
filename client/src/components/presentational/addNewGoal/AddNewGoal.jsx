import React, { useState, useRef } from 'react';
import axios from 'axios';
import Style from './addNewGoal.module.scss';
import { Button } from 'components';

export default function AddNewGoal() {
	// const [nameInput, setNameInput] = useState('');
	// const [categoryInput, setCategoryInput] = useState('');
	// const [timesPerWeek, setTimesPerWeek] = useState(0);

	let nameInput = useRef('');
	let categoryInput = useRef('');
	let timesPerWeek = useRef(0);

	// function handleNameInputChanged(e) {
	// 	setNameInput(e.target.value);
	// 	console.log(nameInput);
	// };

	async function addGoal(e) {
		e.preventDefault();
		const name = nameInput.current.value;
		const category = categoryInput.current.value;
		const amount = timesPerWeek.current.value;
		try {
			for (let i = 0; i < amount; i++) {
				await axios.post(`http://localhost:10000/goals?name=${name}&category=${category}`);
				console.log(`NEW GOAL CREATED ${amount} times`);
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
					<input type='text' name='goal' id='goal' ref={nameInput} />
				</div>
				<div>
					<label htmlFor='category'>Category</label>
					<select name='category' id='category' ref={categoryInput}>
						<option value=''>--Select--</option>
						<option value='Fitness'>Fitness</option>
						<option value='Nutrition'>Nutrition</option>
						<option value='Mindfulness'>Mindfulness</option>
					</select>
				</div>
				<div>
					<label htmlFor='times'>Times per week</label>
					<input type='number' id='times' ref={timesPerWeek} />
				</div>
				<button onClick={addGoal} className={Style.smallButton}>
					Submit
				</button>
			</form>
		</div>
	);
}
