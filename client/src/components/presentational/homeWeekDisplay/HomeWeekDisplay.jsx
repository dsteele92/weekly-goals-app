import React, { useState } from 'react';
import axios from 'axios';
import Style from './homeWeekDisplay.module.scss';

import { Checkbox } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

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
	if (goalsList.length === 0 && allCategories.length === 0) {
		getGoals();
	}

	// this will be used to make sure that all of the data has been loaded
	// before returning the page content... returning the child components without the data causes an error

	const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	async function handleCheckbox(e, id) {
		const checked = e.target.checked;
		const data = { completed: checked };
		const response = await axios({
			method: 'put',
			url: `http://localhost:10000/goals/${id}`,
			data: data,
		});
		if (response.status === 200) {
			let arrayCopy = JSON.parse(JSON.stringify(goalsList));
			const updated = arrayCopy.map((goal) => {
				if (goal._id === id) {
					let copy = JSON.parse(JSON.stringify(goal));
					console.log(copy);
					copy.completed = checked;
					console.log(copy);
					return copy;
				} else {
					return goal;
				}
			});
			setGoalsList(updated);
		}
	}

	return (
		<div className={Style.homeWeekDisplay}>
			{weekdays.map((day, index) => (
				<div key={index} className={Style.day}>
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
													(cat) => cat.name.toLowerCase() === goal.category.toLowerCase()
												)[0].color
											}`
										]
									}>
									{goal.name}
									<ThemeProvider theme={theme}>
										<Checkbox
											inputProps={{ 'aria-label': 'Complete? Y/N' }}
											color='light'
											onChange={(e) => handleCheckbox(e, goal._id)}
											checked={goal.completed}
										/>
									</ThemeProvider>
								</li>
							))}
					</ul>
				</div>
			))}
		</div>
	);
}
