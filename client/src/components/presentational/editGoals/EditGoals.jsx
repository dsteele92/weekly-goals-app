import React, { useState } from 'react';
import axios from 'axios';
import Style from './editGoals.module.scss';
import { AddGoal, UpdateGoal, DeleteGoal } from 'components';
// Material UI -->
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function EditGoals() {
	const [goalsList, setGoalsList] = useState([]);

	const [editGoal, setEditGoal] = useState(false);
	const [deleteGoal, setDeleteGoal] = useState(false);

	async function getGoals() {
		try {
			const goals = await axios.get('http://localhost:10000/goals');
			console.log(goalsList);
			if (JSON.stringify(goalsList) !== JSON.stringify(goals.data)) {
				setGoalsList(goals.data);
				console.log(goals.data);
			}
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the ListAllGoals component
	// getGoals function will be passed through as prop (rerenderList) for AddGoal component
	// --> so that after adding a new goal, getGoals can be called to update the list and rerender
	if (goalsList.length === 0) {
		getGoals();
	}

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

	function handleEditUnmount() {
		setEditGoal(false);
	}
	function handleDeleteUnmount() {
		setDeleteGoal(false);
	}

	function editClick(data) {
		setEditGoal(data);
	}
	function deleteClick(data) {
		setDeleteGoal(data);
	}

	return (
		<div className={Style.editGoals}>
			<AddGoal rerenderList={getGoals} categories={categories} />
			<div className={Style.goalsDisplay}>
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
								: Style.custom
						}>
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
										<span>
											<EditOutlinedIcon fontSize='small' onClick={() => editClick(goal)} />
											<DeleteOutlinedIcon fontSize='small' onClick={() => deleteClick(goal)} />
										</span>
									</li>
								))}
						</ul>
					</div>
				))}
				{!(editGoal === false) ? (
					<UpdateGoal
						name={editGoal.name}
						category={editGoal.category}
						timesPerWeek={editGoal.timesPerWeek}
						id={editGoal._id}
						unmount={handleEditUnmount}
						rerenderList={getGoals}
						categories={categories}
					/>
				) : (
					''
				)}
				{!(deleteGoal === false) ? (
					<DeleteGoal
						name={deleteGoal.name}
						category={deleteGoal.category}
						timesPerWeek={deleteGoal.timesPerWeek}
						id={deleteGoal._id}
						unmount={handleDeleteUnmount}
						rerenderList={getGoals}
						categories={categories}
					/>
				) : (
					''
				)}
			</div>
		</div>
	);
}
