import React from 'react';
import axios from 'axios';
import Style from './deleteGoal.module.scss';

export default function DeleteGoal(props) {
	console.log(props.index);

	async function deleteGoal(e) {
		e.preventDefault();
		try {
			await axios.delete(`http://localhost:10000/goals/${props.id}`);
			console.log(`GOAL(S) DELETED`);
			props.rerenderList();
			props.unmount();
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h2>Are you sure?</h2>
				<div className={Style.infoDisplay}>
					{`Delete ${props.name}`}
					{props.timesPerWeek > 1 ? <span className={Style.listCount}>{`X${props.timesPerWeek}`}</span> : ''}?
				</div>
				<div className={Style.buttons}>
					<button className={Style.cancelButton} onClick={props.unmount}>
						Cancel
					</button>
					<button className={Style.deleteButton} onClick={deleteGoal}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
