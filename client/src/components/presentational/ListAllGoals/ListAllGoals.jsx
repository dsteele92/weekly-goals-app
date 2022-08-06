import React, { useState } from 'react';
import axios from 'axios';
import Style from './listAllGoals.module.scss';

import { AddGoal } from 'components';

export default function ListAllGoals() {
	const [goalsList, setGoalsList] = useState([]);

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

	// this will run the axios request on the first render of the ListAllGoals component
	/* getGoals function will be passed through as prop (rerenderList) for AddGoal component
	--> so that after adding a new goal, getGoals can be called to update the list and rerender */
	if (goalsList.length === 0) {
		getGoals();
	}

	/* this iterates through the goalsList and creates an array of all of the current categories
	--> use the categories array to map out the divs for each list */
	let categories = [];
	for (const goal in goalsList) {
		const category = goalsList[goal].category;
		let catExists = false;
		for (const cat in categories) {
			if (category.toLowerCase() === categories[cat].toLowerCase()) {
				catExists = true;
				break;
			}
		}
		if (!catExists) {
			categories.push(category);
		}
	}

	return (
		<div className={Style.listAllGoals}>
			<AddGoal rerenderList={getGoals} categories={categories} />
			{categories.map((cat, index) => (
				<div
					key={index}
					className={
						cat === 'Fitness'
							? Style.fitness
							: cat === 'Nutrition'
							? Style.nutrition
							: cat === 'Mindfulness'
							? Style.mindfulness
							: Style.container
					}>
					<h2>{cat}</h2>
					<ul>
						{goalsList
							.filter((goal) => goal.category.toLowerCase() === cat.toLowerCase())
							.map((goal, index) => (
								<li key={index}>
									{goal.name}
									{goal.timesPerWeek > 1 ? (
										<span className={Style.listCount}>{`X${goal.timesPerWeek}`}</span>
									) : (
										''
									)}
								</li>
							))}
					</ul>
				</div>
			))}
		</div>
	);
}
