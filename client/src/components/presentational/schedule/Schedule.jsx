import React, { useState } from 'react';
import axios from 'axios';
import Style from './schedule.module.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { GoalCalendarBlock } from 'components';

export default function Schedule() {
	const [allCategories, setAllCategories] = useState([]);
	const [goalsDisplay, setGoalsDisplay] = useState([]);

	let goalsList;

	async function getGoals() {
		try {
			const categories = await axios.get('http://localhost:10000/category');
			const goals = await axios.get('http://localhost:10000/goals');
			// Promise.all([categories, goals]);
			goalsList = goals.data;
			console.log(goals.data);

			let allGoals = [];
			for (const goal in goalsList) {
				const count = goalsList[goal].timesPerWeek;
				for (let i = 0; i < count; i++) {
					// dropId is for tracking the movement of the display blocks
					// dayInfo is for tracking the day and dayIndex of the individual display blocks
					const dropId = goalsList[goal]._id.concat(`_${i}`);
					const dayInfo = goalsList[goal].days[i];
					const data = { ...goalsList[goal], dropId, dayInfo };
					allGoals.push(data);
				}
			}
			console.log(allGoals);
			setAllCategories(categories.data);
			setGoalsDisplay(allGoals);
		} catch (e) {
			console.log(e);
		}
	}

	// this will run the axios request on the first render of the component
	let needToLoad = allCategories.length === 0 && goalsDisplay.length === 0;
	// run getCategories() first so that needToLoad will turn false and wont have multiple axios requests
	if (needToLoad) {
		getGoals();
	}

	/*
	this will be used to make sure that all of the data has been loaded
	before returning the page content... returning the child components without the data causes an error
	> unassignedGoals is the last state to be set after the axios request
	*/
	let loaded = allCategories.length !== 0 && goalsDisplay.length !== 0;

	function handleOnDragEnd(result) {
		if (!result.destination) return;
		console.log(result);

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

		// > for other goals in the source list (except for unassigned list), if index is greater, subtract it by 1
		// > for other goals in the destination list (except for unassigned list), if index is greater, increase it by 1

		for (const item in items) {
			const goal = items[item];
			if (goal.dropId !== result.draggableId) {
				if (source !== destination) {
					if (source in goal.dayInfo) {
						if (goal.dayInfo[source] > sourceIndex) {
							goal.dayInfo[source]--;
						}
					}
					if (destination in goal.dayInfo) {
						if (goal.dayInfo[destination] >= destinationIndex) {
							goal.dayInfo[destination]++;
						}
					}
				} else {
					if (source in goal.dayInfo) {
						if (goal.dayInfo[source] < sourceIndex && goal.dayInfo[source] >= destinationIndex) {
							goal.dayInfo[source]++;
						}
						if (goal.dayInfo[source] > sourceIndex && goal.dayInfo[source] <= destinationIndex) {
							goal.dayInfo[source]--;
						}
					}
				}
			}
			setGoalsDisplay(items);
		}
		console.log(items.filter((goal) => goal.dropId === result.draggableId));
		// console.log(goalsDisplay.filter((goal) => 'tuesday' in goal.dayInfo));
	}

	// > obtain the number after _ in dayId
	// >> let _ = dayId.indexOf(_)
	// >> let subId = dayId.slice(_)
	// > update parent data goalsList.days[subId] = goal.dayInfo
	// ...
	// ON SAVE: if goal has changed, update via axios.put

	// const items = Array.from(goalDisplayBlocks);
	// const [reorderedItem] = items.splice(result.source.index, 1);
	// items.splice(result.destination.index, 0, reorderedItem);
	// console.log(items);

	// setGoalDisplayBlocks(items);

	return (
		<div className={Style.page}>
			{loaded && (
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<section className={Style.unassignedGoals}>
						<Droppable droppableId='unassigned'>
							{(provided) => (
								<ul className='unassigned' {...provided.droppableProps} ref={provided.innerRef}>
									GOALS
									{goalsDisplay
										.filter((goal) => 'unassigned' in goal.dayInfo)
										.map((goal, index) => (
											<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
												{(provided) => (
													<li
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}>
														<GoalCalendarBlock
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
					</section>
					<section className={Style.schedule}>
						<div className={Style.day}>
							<Droppable droppableId='monday'>
								{(provided) => (
									<ul className='monday' {...provided.droppableProps} ref={provided.innerRef}>
										MONDAY
										{goalsDisplay
											.filter((goal) => 'monday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.monday - b.dayInfo.monday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										TUESDAY
										{goalsDisplay
											.filter((goal) => 'tuesday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.tuesday - b.dayInfo.tuesday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										WEDNESDAY
										{goalsDisplay
											.filter((goal) => 'wednesday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.wednesday - b.dayInfo.wednesday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										THURSDAY
										{goalsDisplay
											.filter((goal) => 'thursday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.thursday - b.dayInfo.thursday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										FRIDAY
										{goalsDisplay
											.filter((goal) => 'friday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.friday - b.dayInfo.friday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										SATURDAY
										{goalsDisplay
											.filter((goal) => 'saturday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.saturday - b.dayInfo.saturday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
										SUNDAY
										{goalsDisplay
											.filter((goal) => 'sunday' in goal.dayInfo)
											.sort((a, b) => a.dayInfo.sunday - b.dayInfo.sunday)
											.map((goal, index) => (
												<Draggable key={goal.dropId} draggableId={goal.dropId} index={index}>
													{(provided) => (
														<li
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<GoalCalendarBlock
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
	);
}
