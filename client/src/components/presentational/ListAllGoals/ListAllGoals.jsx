import React, { useState } from 'react';
import axios from 'axios';
import Style from './listAllGoals.module.scss';

export default function ListAllGoals(props) {
	const [goalsList, setGoalsList] = useState([]);

	async function getAllGoals() {
		try {
			const allGoals = await axios.get(`http://localhost:10000/goals?category=${props.category}`);
			if (JSON.stringify(goalsList) !== JSON.stringify(allGoals.data)) {
				setGoalsList(allGoals.data);
				// console.log(allGoals);
			}
		} catch (e) {
			console.log(e);
		}
	}

	getAllGoals();

	return (
		<div className={Style.Container}>
			{/* <button onClick={getAllGoals}>Get Goals List</button> */}
			<h2>{props.category}</h2>
			<ul>
				{goalsList.map((goal, index) => (
					<li key={index}> {goal.name} </li>
				))}
			</ul>
		</div>
	);
}
