import React from 'react';
import Style from './goalCalendarBlock.module.scss';

export default function GoalCalendarBlock(props) {
	// const colorCode = props.category[0].color;
	// console.log(colorCode);

	return (
		<div className={Style.calendarBlockContainer}>
			<div className={Style.calendarBlockFitness}>{props.goal.name}</div>
		</div>
	);
}
