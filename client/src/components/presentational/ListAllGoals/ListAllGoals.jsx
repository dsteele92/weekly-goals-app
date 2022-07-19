import React, { useState } from 'react';
import Style from './listAllGoals.module.scss';
import axios from 'axios';

export default function ListAllGoals() {
	const [goalsList, setGoalsList] = useState([]);

	async function getAllGoals() {
		try {
			const allGoals = await axios.get('http://localhost:10000/goals');
			if (JSON.stringify(goalsList) !== JSON.stringify(allGoals.data)) {
				setGoalsList(allGoals.data);
				console.log(allGoals);
			}
		} catch (e) {
			console.log(e);
		}
	}

	getAllGoals();

	return (
		<div>
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
