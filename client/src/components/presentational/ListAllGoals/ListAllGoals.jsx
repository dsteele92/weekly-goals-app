import React, { useState } from 'react';
import axios from 'axios';
import Style from './listAllGoals.module.scss';

export default function ListAllGoals() {
	const [goalsList, setGoalsList] = useState([]);

	(async function getGoals() {
		try {
			const goals = await axios.get('http://localhost:10000/goals');
			if (JSON.stringify(goalsList) !== JSON.stringify(goals.data)) {
				setGoalsList(goals.data);
				console.log(goals.data);
			}
		} catch (e) {
			console.log(e);
		}
	})();

	let allGoals = [];
	let categories = [];

	/*
    if the category does not exist, add to category and add to allGoals
    if the category exists, push category into categories array
        -> then check: goal exists ? count++ : push new goal object
    loop through categories array and create a div for each one
        -> use filter method to map the array for each category
    */

	for (const goal in goalsList) {
		const goalData = goalsList[goal];
		const goalName = goalsList[goal].name;
		const category = goalsList[goal].category;
		let catExists = false;
		for (const cat in categories) {
			if (category.toLowerCase() === categories[cat].toLowerCase()) {
				catExists = true;
			}
		}
		if (!catExists) {
			const li = { ...goalData, count: 1 };
			categories.push(category);
			allGoals.push(li);
		} else {
			let goalExists = false;
			for (const obj in allGoals) {
				if (goalName === allGoals[obj].name) {
					goalExists = true;
					allGoals[obj].count++;
				}
			}
			if (!goalExists) {
				const li = { ...goalData, count: 1 };
				allGoals.push(li);
			}
		}
	}

	return (
		<div>
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
					<div>
						<h2>{cat}</h2>
						<ul>
							{allGoals
								.filter((goal) => goal.category.toLowerCase() === cat.toLowerCase())
								.map((goal, index) => (
									<li key={index}>
										{goal.name}
										{goal.count > 1 ? (
											<span className={Style.listCount}>{`X${goal.count}`}</span>
										) : (
											''
										)}
									</li>
								))}
						</ul>
					</div>
				</div>
			))}
		</div>
	);
}
