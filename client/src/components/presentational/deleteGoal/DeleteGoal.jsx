import React, { useState } from 'react';
import axios from 'axios';
import Style from './deleteGoal.module.scss';

export default function DeleteGoal(props) {
	async function deleteGoal(e) {
		e.preventDefault();
		try {
			const responses = [];
			const ids = props.ids;
			for (const id in ids) {
				const response = axios.delete(`http://localhost:10000/goals/${ids[id]}`);
				responses.push(response);
			}
			await Promise.all(responses);
			console.log(`GOAL(S) DELETED`);
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
