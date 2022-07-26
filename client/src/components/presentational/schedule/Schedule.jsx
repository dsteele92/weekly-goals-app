import React, { useState } from 'react';
import axios from 'axios';
// import Style from './schedule.module.scss';

import { GoalCalendarBlock } from 'components';

export default function Schedule() {
	const [goalsList, setGoalsList] = useState([]);
	const [allCategories, setAllCategories] = useState([]);

	async function getGoals() {
		try {
			const goals = await axios.get('http://localhost:10000/goals');
			if (JSON.stringify(goalsList) !== JSON.stringify(goals.data)) {
				setGoalsList(goals.data);
			}
			console.log(goals.data);
		} catch (e) {
			console.log(e);
		}
	}

	async function getCategories() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			setAllCategories(categories.data);
		} catch (e) {
			console.log(e);
		}
	}

	/*this will be used to make sure that all of the data has been loaded
	before rendering all of the GoalCalendarBlock components*/
	let loaded = (goalsList.length !== 0) & (allCategories.length !== 0);

	// this will run the axios request on the first render of the component
	let loading = goalsList.length !== 0 || allCategories.length !== 0;
	if (!loading) {
		getGoals();
		getCategories();
	}

	let goalDisplayBlocks = [];

	for (const goal in goalsList) {
		const count = goalsList[goal].timesPerWeek;
		for (let i = 0; i < count; i++) {
			goalDisplayBlocks.push(goalsList[goal]);
		}
	}

	return (
		<div>
			{loaded ? (
				<div>
					{goalDisplayBlocks.map((goal, index) => (
						<GoalCalendarBlock
							key={index}
							goal={goal}
							category={allCategories.filter((cat) => cat.name === goal.category)}
						/>
					))}
				</div>
			) : (
				<div>not loaded</div>
			)}
		</div>
	);
}
