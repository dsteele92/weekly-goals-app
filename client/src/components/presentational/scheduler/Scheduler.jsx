import React, { useState } from 'react';
import axios from 'axios';
import Style from './scheduler.module.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { SchedulerGoalBlock } from 'components';

export default function Scheduler() {
	// goalsList is the data set from database, with each goal only once
	// goalsDisplay is the list with an object for every instance of each goal
	const [goalsList, setGoalsList] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [updatedIds, setUpdatedIds] = useState([]);

	async function getGoals() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			console.log(goals.data);

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

	function handleOnDragEnd(result) {
		if (!result.destination) return;
		console.log(result);

		let changes = [];

		const source = result.source.droppableId;
		const sourceIndex = result.source.index;
		const destination = result.destination.droppableId;
		const destinationIndex = result.destination.index;

		// > find index of goal being moved
		const items = Array.from(goalsList);
		const index = items.findIndex((goal) => goal._id === result.draggableId);

		// 3 changes to make: update day, update day index, track the id being changed in an array
		items[index].day = destination;
		items[index].dayIndex = destinationIndex;
		changes.push(result.draggableId);

		// > for other goals in the source list (except for unassigned list), if index is greater, subtract it by 1
		// > for other goals in the destination list (except for unassigned list), if index is greater, increase it by 1

		for (const item in items) {
			const goal = items[item];
			if (goal._id !== result.draggableId) {
				if (source !== destination) {
					if (source === goal.day) {
						if (goal.dayIndex > sourceIndex) {
							goal.dayIndex--;
							changes.push(goal._id);
						}
					}
					if (destination === goal.day) {
						if (goal.dayIndex >= destinationIndex) {
							goal.dayIndex++;
							changes.push(goal._id);
						}
					}
				} else {
					if (source === goal.day) {
						if (goal.dayIndex < sourceIndex && goal.dayIndex >= destinationIndex) {
							goal.dayIndex++;
							changes.push(goal._id);
						}
						if (goal.dayIndex > sourceIndex && goal.dayIndex <= destinationIndex) {
							goal.dayIndex--;
							changes.push(goal._id);
						}
					}
				}
			}
			setGoalsList(items);

			// we have added all of the changed ids to the changes array
			// iterate through that and update the updatedIds state to include them (if they are not already included)
			let ids = Array.from(updatedIds);
			for (const change in changes) {
				if (!ids.includes(changes[change])) {
					ids.push(changes[change]);
				}
				setUpdatedIds(ids);
			}
		}
	}

	/*
	ON SAVE:
	*/
	const onSave = async function () {
		// 	// updates will contain the object to be passed into the update PUT request
		// 	// ids array will be used to check if object for that id has already been created or not
		// 	let updates = [];
		// 	const ids = [];
		// 	for (const item in updatedDropIds) {
		// 		const dropId = updatedDropIds[item];
		// 		const subIdIndex = dropId.indexOf('_') + 1;
		// 		const subId = dropId.slice(subIdIndex);
		// 		const id = dropId.slice(0, subIdIndex - 1);
		// 		const updatedGoal = goalsDisplay.filter((goal) => goal.dropId === dropId);
		// 		const newData = updatedGoal[0].dayInfo;
		// 		if (!ids.includes(id)) {
		// 			// console.log('NEW UPDATE DATA');
		// 			const originalGoal = goalsList.filter((goal) => goal._id === id);
		// 			const days = originalGoal[0].days;
		// 			days[subId] = newData;
		// 			const updateData = {
		// 				id: id,
		// 				days: days,
		// 			};
		// 			updates.push(updateData);
		// 			ids.push(id);
		// 		} else {
		// 			const index = ids.indexOf(id);
		// 			updates[index].days[subId] = newData;
		// 		}
		// 	}
		// 	console.log(updates);
		let requests = [];
		// console.log(goalsList);
		// console.log(updatedIds);
		for (const updatedId in updatedIds) {
			const id = updatedIds[updatedId];
			const data = goalsList.filter((goal) => goal._id === id)[0];
			const updateData = {
				day: data.day,
				dayIndex: data.dayIndex,
			};
			console.log(updateData);
			const request = axios({
				method: 'put',
				url: `http://localhost:10000/goals/${id}`,
				data: updateData,
			});
			requests.push(request);
		}
		Promise.all(requests)
			.then((values) => console.log(values))
			.catch((err) => console.log(err));
	};

	return (
		<div className={Style.page}>
			<div className={Style.scheduler}>
				{loaded && (
					<DragDropContext onDragEnd={handleOnDragEnd}>
						<section className={Style.unassignedGoals}>
							<div>
								<Droppable droppableId='unassigned'>
									{(provided) => (
										<ul className='unassigned' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Goals</h3>
											<p>Drag goals to desired day, then click save.</p>
											{goalsList
												.filter((goal) => goal.day === 'unassigned')
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
						</section>
						<section className={Style.week}>
							<div className={Style.day}>
								<Droppable droppableId='Monday'>
									{(provided) => (
										<ul className='Monday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Monday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Monday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Tuesday'>
									{(provided) => (
										<ul className='Tuesday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Tuesday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Tuesday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Wednesday'>
									{(provided) => (
										<ul className='Wednesday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Wednesday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Wednesday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Thursday'>
									{(provided) => (
										<ul className='Thursday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Thursday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Thursday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Friday'>
									{(provided) => (
										<ul className='Friday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Friday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Friday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Saturday'>
									{(provided) => (
										<ul className='Saturday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Saturday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Saturday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
							<div className={Style.day}>
								<Droppable droppableId='Sunday'>
									{(provided) => (
										<ul className='Sunday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Sunday</h3>
											{goalsList
												.filter((goal) => goal.day === 'Sunday')
												.sort((a, b) => a.dayIndex - b.dayIndex)
												.map((goal, index) => (
													<Draggable key={goal._id} draggableId={goal._id} index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) =>
																			cat.name.toLowerCase() ===
																			goal.category.toLowerCase()
																	)}
																/>
															</li>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</ul>
									)}
								</Droppable>
							</div>
						</section>
					</DragDropContext>
				)}
			</div>
			<button onClick={onSave} className={Style.saveButton}>
				SAVE
			</button>
		</div>
	);
}
