import React from 'react';
import Style from './homeGoalBlock.module.scss';

export default function HomeGoalBlock(props) {
	// const colorCode = props.category[0].color;
	const colorCode = 1;

	/*
    need to figure out how to edit specific index of objects in mongo
    may need to next another object
    days: [
        0: {
            day: 'thursday',
            complete: false
        }
    ]
    ---> then edit days[dayIndex][complete]

    create toggle function for checkbox
    */

	return (
		<div className={Style.calendarBlockContainer}>
			<div className={Style.checkbox}>O</div>
			<div className={Style[`calendarBlock${colorCode}`]}>{props.goal.name}</div>
		</div>
	);
}
