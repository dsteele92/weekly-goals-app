import React, { useState } from 'react';
import axios from 'axios';
import Style from './scheduler.module.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { SchedulerGoalBlock, Header } from 'components';

export default function Scheduler() {
	// goalsList is the data set from database, with each goal only once
	// goalsDisplay is the list with an object for every instance of each goal
	const [goalsList, setGoalsList] = useState([]);
	const [goalsDisplay, setGoalsDisplay] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [updatedDropIds, setUpdatedDropIds] = useState([]);

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
					const dropId = goalsData[goal]._id.concat(`_${i}`);
					const dayInfo = goalsData[goal].days[i];
					const data = { ...goalsData[goal], dropId, dayInfo };
					allGoals.push(data);
				}
			}
			console.log(allGoals);
			setAllCategories(categories.data);
			setGoalsDisplay(allGoals);
			setGoalsList(goalsData);
			// console.log(allGoals.filter((goal) => 'wednesday' in goal.dayInfo));
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

	function handleOnDragEnd(result) {
		if (!result.destination) return;
		console.log(result);

		let changes = [];

		// const trackChanges = function (dropId) {
		// 	let update = Array.from(updatedDropIds);
		// 	if (!update.includes(dropId)) {
		// 		update.push(dropId);
		// 		setUpdatedDropIds(update);
		// 	}
		// };

		/*
		>>> dropId and dayInfo are used to track the movement and data changes of each goal
		>>> _id and days (on original objects in goalsList) are used to update the database
		*/

		const source = result.source.droppableId;
		const sourceIndex = result.source.index;
		const destination = result.destination.droppableId;
		const destinationIndex = result.destination.index;

		// > find index of goal being moved
		const items = Array.from(goalsDisplay);
		const index = items.findIndex((goal) => goal.dropId === result.draggableId);

		// > delete property for the day it came from, then add new property for the day it is being assigned to
		// delete items[index].dayInfo[source];
		// items[index].dayInfo[destination] = destinationIndex;

		let update = {};
		update[destination] = destinationIndex;
		items[index].dayInfo = update;

		changes.push(result.draggableId);

		// > for other goals in the source list (except for unassigned list), if index is greater, subtract it by 1
		// > for other goals in the destination list (except for unassigned list), if index is greater, increase it by 1

		for (const item in items) {
			const goal = items[item];
			if (goal.dropId !== result.draggableId) {
				if (source !== destination) {
					if (source in goal.dayInfo) {
						if (goal.dayInfo[source] > sourceIndex) {
							goal.dayInfo[source]--;
							changes.push(goal.dropId);
						}
					}
					if (destination in goal.dayInfo) {
						if (goal.dayInfo[destination] >= destinationIndex) {
							goal.dayInfo[destination]++;
							changes.push(goal.dropId);
						}
					}
				} else {
					if (source in goal.dayInfo) {
						if (goal.dayInfo[source] < sourceIndex && goal.dayInfo[source] >= destinationIndex) {
							goal.dayInfo[source]++;
							changes.push(goal.dropId);
						}
						if (goal.dayInfo[source] > sourceIndex && goal.dayInfo[source] <= destinationIndex) {
							goal.dayInfo[source]--;
							changes.push(goal.dropId);
						}
					}
				}
			}
			setGoalsDisplay(items);

			let dropIds = Array.from(updatedDropIds);
			for (const change in changes) {
				if (!dropIds.includes(changes[change])) {
					dropIds.push(changes[change]);
				}
				setUpdatedDropIds(dropIds);
			}
		}

		/*
		to keep track of changes:
		create state array of updated dropId's --> updatedDropIds
		*/
	}

	/*
	ON SAVE:
	*/
	const onSave = async function () {
		// updates will contain the object to be passed into the update PUT request
		// ids array will be used to check if object for that id has already been created or not
		let updates = [];
		const ids = [];
		for (const item in updatedDropIds) {
			const dropId = updatedDropIds[item];
			const subIdIndex = dropId.indexOf('_') + 1;
			const subId = dropId.slice(subIdIndex);
			const id = dropId.slice(0, subIdIndex - 1);

			const updatedGoal = goalsDisplay.filter((goal) => goal.dropId === dropId);
			const newData = updatedGoal[0].dayInfo;

			if (!ids.includes(id)) {
				// console.log('NEW UPDATE DATA');
				const originalGoal = goalsList.filter((goal) => goal._id === id);
				const days = originalGoal[0].days;
				days[subId] = newData;

				const updateData = {
					id: id,
					days: days,
				};

				updates.push(updateData);
				ids.push(id);
			} else {
				const index = ids.indexOf(id);
				updates[index].days[subId] = newData;
			}
		}
		console.log(updates);

		let requests = [];

		for (const update in updates) {
			const updateId = updates[update].id;
			const updateData = { days: updates[update].days };
			const request = axios({
				method: 'put',
				url: `http://localhost:10000/goals/${updateId}`,
				data: updateData,
			});
			requests.push(request);
		}
		Promise.all(requests)
			.then((values) => console.log(values))
			.catch((err) => console.log(err));
	};

	// > obtain the number after _ in dayId
	// >> let _ = dayId.indexOf(_)
	// >> let subId = dayId.slice(_)
	// > update parent data goalsList.days[subId] = goal.dayInfo
	// ...
	// ON SAVE: if goal has changed, update via axios.put

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
											{goalsDisplay
												.filter((goal) => 'unassigned' in goal.dayInfo)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='monday'>
									{(provided) => (
										<ul className='monday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Monday</h3>
											{goalsDisplay
												.filter((goal) => 'monday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.monday - b.dayInfo.monday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='tuesday'>
									{(provided) => (
										<ul className='tuesday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Tuesday</h3>
											{goalsDisplay
												.filter((goal) => 'tuesday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.tuesday - b.dayInfo.tuesday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='wednesday'>
									{(provided) => (
										<ul className='wednesday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Wednesday</h3>
											{goalsDisplay
												.filter((goal) => 'wednesday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.wednesday - b.dayInfo.wednesday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='thursday'>
									{(provided) => (
										<ul className='thursday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Thursday</h3>
											{goalsDisplay
												.filter((goal) => 'thursday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.thursday - b.dayInfo.thursday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='friday'>
									{(provided) => (
										<ul className='friday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Friday</h3>
											{goalsDisplay
												.filter((goal) => 'friday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.friday - b.dayInfo.friday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='saturday'>
									{(provided) => (
										<ul className='saturday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Saturday</h3>
											{goalsDisplay
												.filter((goal) => 'saturday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.saturday - b.dayInfo.saturday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
								<Droppable droppableId='sunday'>
									{(provided) => (
										<ul className='sunday' {...provided.droppableProps} ref={provided.innerRef}>
											<h3>Sunday</h3>
											{goalsDisplay
												.filter((goal) => 'sunday' in goal.dayInfo)
												.sort((a, b) => a.dayInfo.sunday - b.dayInfo.sunday)
												.map((goal, index) => (
													<Draggable
														key={goal.dropId}
														draggableId={goal.dropId}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}>
																<SchedulerGoalBlock
																	goal={goal}
																	category={allCategories.filter(
																		(cat) => cat.name === goal.category
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
