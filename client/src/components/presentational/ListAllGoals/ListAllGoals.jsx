import React, { useState } from 'react';
import axios from 'axios';
import Style from './listAllGoals.module.scss';
// Material UI -->
import EditIcon from '@mui/icons-material/Edit';

export default function ListAllGoals(props) {
	const [goalsList, setGoalsList] = useState([]);

	(async function getAllGoals() {
		try {
			const allGoals = await axios.get(`http://localhost:10000/goals?category=${props.category}`);
			if (JSON.stringify(goalsList) !== JSON.stringify(allGoals.data)) {
				setGoalsList(allGoals.data);
				console.log(allGoals.data);
			}
		} catch (e) {
			console.log(e);
		}
	})();

	let goalsDisplay = [];

	for (const goal in goalsList) {
		let goalName = goalsList[goal].name;
		let exists = false;
		for (const obj in goalsDisplay) {
			if (goalName === goalsDisplay[obj].name) {
				exists = true;
				goalsDisplay[obj].count++;
			}
		}
		if (!exists) {
			let li = { name: goalName, count: 1 };
			goalsDisplay.push(li);
			console.log(goalsDisplay);
		}
	}

	return (
		<div className={Style.Container}>
			{/* <button onClick={getAllGoals}>Get Goals List</button> */}
			<h2>{props.category}</h2>
			<EditIcon className={Style.editIcon} fontSize='small' />
			<ul>
				{goalsDisplay.map((goal, index) => (
					<li key={index}>
						{goal.name}
						{goal.count > 1 ? <span className={Style.listCount}>{`X${goal.count}`}</span> : ''}
					</li>
				))}
			</ul>
		</div>
	);
}
