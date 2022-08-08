import React, { useState } from 'react';
import axios from 'axios';
import Style from './homeWeekDisplay.module.scss';

// import { HomeGoalBlock } from 'components';

export default function HomeWeekDisplay() {
	const [goalsList, setGoalsList] = useState([]);
	const [allCategories, setAllCategories] = useState([]);

	async function getGoals() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			console.log(goals.data);
			console.log(categories.data);

			setAllCategories(categories.data);
			setGoalsList(goals.data);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the component
	let needToLoad = allCategories.length === 0 && goalsList.length === 0;
	// run getCategories() first so that needToLoad will turn false and wont have multiple axios requests
	if (needToLoad) {
		getGoals();
	}

	// this will be used to make sure that all of the data has been loaded
	// before returning the page content... returning the child components without the data causes an error
	let loaded = allCategories.length !== 0 && goalsList.length !== 0;

	const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	return (
		<div className={Style.homeWeekDisplay}>
			{loaded && (
				<div>
					{weekdays.map((day, index) => (
						<div key={index} className={Style.container}>
							<ul>
								<h2 className={Style.header}>{day}</h2>
								{goalsList
									.filter((goal) => goal.day === day)
									.sort((a, b) => a.dayIndex - b.dayIndex)
									.map((goal, index) => (
										<li
											key={index}
											className={
												Style[
													`goal${
														allCategories.filter(
															(cat) =>
																cat.name.toLowerCase() === goal.category.toLowerCase()
														)[0].color
													}`
												]
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
