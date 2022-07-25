import React, { useState } from 'react';
import axios from 'axios';
import Style from './editGoals.module.scss';
import { UpdateGoal, DeleteGoal } from 'components';
// Material UI -->
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function EditGoals() {
	const [goalsList, setGoalsList] = useState([]);

	const [editGoal, setEditGoal] = useState(false);
	const [deleteGoal, setDeleteGoal] = useState(false);

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

	let goalsDisplay = [];
	let categories = [];

	/*
    if the category does not exist, add to category and add to goalsDisplay
    if the category exists, push category into categories array
        -> then check: goal exists ? count++ : push new goal object
    loop through categories array and create a div for each one
        -> use filter method to map the array for each category
    */

	for (const goal in goalsList) {
		const goalData = goalsList[goal];
		const goalName = goalsList[goal].name;
		const category = goalsList[goal].category;
		const id = goalsList[goal]._id;
		let catExists = false;
		for (const cat in categories) {
			if (category.toLowerCase() === categories[cat].toLowerCase()) {
				catExists = true;
			}
		}
		if (!catExists) {
			const li = { ...goalData, count: 1, ids: [id] };
			categories.push(category);
			goalsDisplay.push(li);
		} else {
			let goalExists = false;
			for (const obj in goalsDisplay) {
				if (goalName === goalsDisplay[obj].name) {
					goalExists = true;
					goalsDisplay[obj].count++;
					goalsDisplay[obj].ids.push(id);
					delete goalsDisplay[obj]._id;
				}
			}
			if (!goalExists) {
				const li = { ...goalData, count: 1, ids: [id] };
				goalsDisplay.push(li);
			}
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
		<div>
			<h1>Edit Goals</h1>
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
							{goalsDisplay
								.filter((goal) => goal.category.toLowerCase() === cat.toLowerCase())
								.map((goal, index) => (
									<li key={index}>
										{goal.name}
										{goal.count > 1 ? (
											<span className={Style.listCount}>{`X${goal.count}`}</span>
										) : (
											''
										)}
										<span className={Style.EditIcon}>
											<EditOutlinedIcon fontSize='small' onClick={() => editClick(goal)} />
											<DeleteOutlinedIcon fontSize='small' onClick={() => deleteClick(goal)} />
										</span>
									</li>
								))}
						</ul>
					</div>
				</div>
			))}
			{!(editGoal === false) ? (
				<UpdateGoal
					name={editGoal.name}
					category={editGoal.category}
					ids={editGoal.ids}
					unmount={handleEditUnmount}
				/>
			) : (
				''
			)}
			{!(deleteGoal === false) ? (
				<DeleteGoal
					name={deleteGoal.name}
					category={deleteGoal.category}
					ids={deleteGoal.ids}
					unmount={handleDeleteUnmount}
				/>
			) : (
				''
			)}
		</div>
	);
}
