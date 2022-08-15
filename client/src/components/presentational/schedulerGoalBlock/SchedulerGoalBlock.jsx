import React from 'react';
import Style from './schedulerGoalBlock.module.scss';

export default function SchedulerGoalBlock(props) {
	const colorCode = props.category[0].color;

	return (
		<div className={Style.calendarBlockContainer}>
			<div className={Style[`calendarBlock${colorCode}`]}>
				<p className={Style.displayName}>{props.goal.name}</p>
			</div>
		</div>
	);
}
