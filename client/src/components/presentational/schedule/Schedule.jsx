import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Style from './schedule.module.scss';

import { GoalCalendarBlock } from 'components';

export default function Schedule() {
	const [goalsList, setGoalsList] = useState([]);
	const [allCategories, setAllCategories] = useState([]);

	useEffect(() => {
		let cancel = false;
		async function getGoals() {
			try {
				const goals = await axios.get('http://localhost:10000/goals');
				if (cancel) return;
				if (JSON.stringify(goalsList) !== JSON.stringify(goals.data)) {
					setGoalsList(goals.data);
				}
				console.log(goals.data);
			} catch (e) {
				console.log(e);
			}
		}

		if (allCategories.length === 0) {
			getGoals();
		}

		return () => {
			cancel = true;
		};
	});

	useEffect(() => {
		let cancel = false;
		async function getCategories() {
			try {
				const categories = await axios.get('http://localhost:10000/category');
				setAllCategories(categories.data);
			} catch (e) {
				console.log(e);
			}
		}

		if (allCategories.length === 0) {
			getCategories();
		}

		return () => {
			cancel = true;
		};
	});

	// async function getGoals() {
	// 	try {
	// 		const goals = await axios.get('http://localhost:10000/goals');
	// 		if (JSON.stringify(goalsList) !== JSON.stringify(goals.data)) {
	// 			setGoalsList(goals.data);
	// 		}
	// 		console.log(goals.data);
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	// async function getCategories() {
	// 	try {
	// 		const categories = await axios.get('http://localhost:10000/category');
	// 		setAllCategories(categories.data);
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// }

	// // this will run the axios request on the first render of the component
	// if (allCategories.length === 0) {
	// 	getGoals();
	// 	getCategories();
	// }

	let goalDisplayBlocks = [];

	for (const goal in goalsList) {
		const count = goalsList[goal].timesPerWeek;
		for (let i = 0; i < count; i++) {
			goalDisplayBlocks.push(goalsList[goal]);
		}
	}

	return (
		<div>
			{goalDisplayBlocks.map((goal, index) => (
				<GoalCalendarBlock
					key={index}
					goal={goal}
					category={allCategories.filter((cat) => cat.name === goal.category)}
				/>
			))}
		</div>
	);
}
