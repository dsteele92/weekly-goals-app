import React, { useState } from 'react';
import Style from './editGoals.module.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function EditGoals() {
	const [goalsList, setGoalsList] = useState([]);

	async function getAllGoals() {
		try {
			const allGoals = await axios.get('http://localhost:10000/cats');
			if (JSON.stringify(goalsList) !== JSON.stringify(allGoals.data)) {
				setGoalsList(allGoals.data);
				console.log(allGoals.data);
			}
		} catch (e) {
			console.log(e);
		}
	}

	getAllGoals();

	const addNew = (e) => {
		e.preventDefault();
		console.log(e);
	};

	return (
		<div>
			<form onSubmit={addNew}>
				<label htmlFor='goal'>Goal</label>
				<input type='text' name='goal' id='goal' placeholder='Enter goal' />
				<button>Submit</button>
			</form>
			{/* <button onClick={getAllGoals}>Get Goals List</button> */}
			<h2>All Goals:</h2>
			<ul>
				{goalsList.map((goal, index) => (
					<li key={index}> {goal.name} </li>
				))}
			</ul>
		</div>
	);
}
