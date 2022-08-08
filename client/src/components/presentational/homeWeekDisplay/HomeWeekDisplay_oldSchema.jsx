import React, { useState } from 'react';
import axios from 'axios';
import Style from './homeWeekDisplay.module.scss';

import { HomeGoalBlock } from 'components';

export default function HomeWeekDisplay() {
	const [goalsList, setGoalsList] = useState([]);
	const [goalsDisplay, setGoalsDisplay] = useState([]);
	const [allCategories, setAllCategories] = useState([]);

	async function getGoals() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			const goalsData = goals.data;
			console.log(goals.data);

			let allGoals = [];
			for (const goal in goalsData) {
				const count = goalsData[goal].timesPerWeek;
				for (let i = 0; i < count; i++) {
					// dropId is for tracking the movement of the display blocks
					// dayInfo is for tracking the day and dayIndex of the individual display blocks
					const dayInfo = goalsData[goal].days[i];
					const data = { ...goalsData[goal], dayInfo };
					allGoals.push(data);
				}
			}
			console.log(allGoals);
			setAllCategories(categories.data);
			setGoalsDisplay(allGoals);
			setGoalsList(goalsData);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the component
	let needToLoad = allCategories.length === 0 && goalsDisplay.length === 0 && goalsList.length === 0;
	// run getCategories() first so that needToLoad will turn false and wont have multiple axios requests
	if (needToLoad) {
		getGoals();
	}
	/*
this will be used to make sure that all of the data has been loaded
before returning the page content... returning the child components without the data causes an error
> unassignedGoals is the last state to be set after the axios request
*/
	let loaded = allCategories.length !== 0 && goalsDisplay.length !== 0 && goalsList.length !== 0;

	const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	return (
		<div className={Style.homeWeekDisplay}>
			{loaded && (
				<div>
					{weekdays.map((day, index) => (
						<div key={index} className={Style.container}>
							<ul>
								<h2 className={Style.header}>{day}</h2>
								{goalsDisplay
									.filter((goal) => day in goal.dayInfo)
									.sort((a, b) => a.dayInfo[day] - b.dayInfo[day])
									.map((goal, index) => (
										<li
											key={index}
											className={
												goal.category === 'Fitness'
													? Style.fitnessGoal
													: goal.category === 'Nutrition'
													? Style.nutritionGoal
													: goal.category === 'Mindfulness'
													? Style.mindfulnessGoal
													: Style.customGoal
											}>
											{goal.name}
										</li>
									))}
							</ul>
						</div>
					))}
				</div>
			)}

			{/* <div className={Style.goalsDisplay}>
				{categories.map((cat, index) => (
					<div key={index} className={Style.container}>
						<h2 className={Style.header}>{cat}</h2>
						<ul>
							{goalsList
								.filter((goal) => goal.category.toLowerCase() === cat.toLowerCase())
								.map((goal, index) => (
									<li key={index}>
										<div>
											{goal.name}
											{goal.timesPerWeek > 1 ? (
												<span className={Style.listCount}>{`X${goal.timesPerWeek}`}</span>
											) : (
												''
											)}
										</div>
									</li>
								))}
						</ul>
					</div>
				))}
			</div> */}
		</div>
	);
}
