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
				<h4>Are you sure?</h4>
				<div className={Style.exitButton} onClick={props.unmount}>
					X
				</div>
				<div>{props.name}</div>
				<div>{props.category}</div>
				<button onClick={deleteGoal}>Delete</button>
			</div>
		</div>
	);
}
