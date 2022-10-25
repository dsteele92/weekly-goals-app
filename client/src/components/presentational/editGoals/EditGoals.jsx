import React, { useState } from 'react';
import axios from 'axios';
import Style from './editGoals.module.scss';
import { AddGoal, UpdateGoal, DeleteGoal, ColorSelect, LoadingDots } from 'components';
// Material UI -->
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import * as backend from '../../../backendURL.js';

export default function EditGoals() {
	const [goalsList, setGoalsList] = useState([]);
	const [goalsDisplay, setGoalsDisplay] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	const [editGoal, setEditGoal] = useState(false);
	const [deleteGoal, setDeleteGoal] = useState(false);

	async function getGoals() {
		try {
			const categoriesRequest = await axios.get(`${backend.url}/category`);
			const goals = await axios.get(`${backend.url}/goals`);
			const goalsData = goals.data;
			console.log(categoriesRequest.data);
			console.log(goalsData);
			// only set state if the data has changed
			if (JSON.stringify(goalsList) !== JSON.stringify(goalsData)) {
				setGoalsList(goalsData);
			}
			// --> Consolidate goals w/ multiple X per week into one display item
			let consolidatedData = [];
			for (const goal in goalsData) {
				let goalName = goalsData[goal].name;
				let exists = false;
				for (const item in consolidatedData) {
					if (goalName === consolidatedData[item].name) {
						exists = true;
						consolidatedData[item].count++;
						break;
					}
				}
				if (!exists) {
					let li = { ...goalsData[goal], count: 1 };
					consolidatedData.push(li);
				}
			}
			setAllCategories(categoriesRequest.data);
			setGoalsDisplay(consolidatedData);
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the ListAllGoals component
	// getGoals function will be passed through as prop (rerenderList) for AddGoal component
	if (goalsList.length === 0 && allCategories.length === 0) {
		getGoals();
	}

	//--> filter allCategories data set for currentCategories
	let currentCategories = [];
	goalsList.forEach((goal) => {
		if (!currentCategories.includes(goal.category)) {
			console.log(goal.category);

			currentCategories.push(goal.category);
		}
	});

	if (allCategories.length > 0) {
		const filtered = allCategories.filter((cat) => currentCategories.includes(cat.name));
		if (JSON.stringify(filtered) !== JSON.stringify(categories)) {
			setCategories(filtered);
		}
	}

	// --> functions for updateGoal and deleteGoal modals
	function editClick(data) {
		setEditGoal(data);
	}
	function deleteClick(data) {
		setDeleteGoal(data);
	}

	function handleEditUnmount() {
		setEditGoal(false);
	}
	function handleDeleteUnmount() {
		setDeleteGoal(false);
	}

	return (
		<div className={Style.page}>
			{loading && (
				<div className={Style.modalBackground}>
					<div className={Style.modal}>
						<LoadingDots />
					</div>
				</div>
			)}
			<div className={Style.editGoals}>
				<section className={Style.leftColumn}>
					<AddGoal rerenderList={getGoals} categories={categories} allCategories={allCategories} />
					<ColorSelect rerenderList={getGoals} categories={categories} />
				</section>
				<div className={Style.goalsDisplay}>
					{!loading && goalsDisplay.length === 0 && (
						<div className={Style.modalBackgroundRounded}>
							<div className={Style.modal}>
								<h2>Add new goals to get started!</h2>
							</div>
						</div>
					)}
					{categories.map((cat, index) => (
						<div key={index} className={Style[`container${cat.color}`]}>
							<h2 className={Style.header}>{cat.name}</h2>
							<ul>
								{goalsDisplay
									.filter((goal) => goal.category.toLowerCase() === cat.name.toLowerCase())
									.map((goal, index) => (
										<li key={index}>
											<div>
												{goal.name}
												{goal.count > 1 ? (
													<span className={Style.listCount}>{`X${goal.count}`}</span>
												) : (
													''
												)}
											</div>
											<span className={Style.icons}>
												<div>
													<EditOutlinedIcon
														fontSize='small'
														onClick={() => editClick(goal)}
													/>
												</div>
												<div>
													<DeleteOutlinedIcon
														fontSize='small'
														onClick={() => deleteClick(goal)}
													/>
												</div>
											</span>
										</li>
									))}
							</ul>
						</div>
					))}
				</div>
			</div>
			{editGoal && (
				<UpdateGoal
					name={editGoal.name}
					category={editGoal.category}
					timesPerWeek={editGoal.count}
					goals={goalsList}
					unmount={handleEditUnmount}
					rerenderList={getGoals}
					categories={categories}
					allCategories={allCategories}
				/>
			)}
			{deleteGoal && (
				<DeleteGoal
					name={deleteGoal.name}
					category={deleteGoal.category}
					timesPerWeek={deleteGoal.count}
					goals={goalsList}
					unmount={handleDeleteUnmount}
					rerenderList={getGoals}
					allCategories={allCategories}
				/>
			)}
		</div>
	);
}
