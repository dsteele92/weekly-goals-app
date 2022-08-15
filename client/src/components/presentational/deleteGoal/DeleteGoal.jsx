import React from 'react';
import axios from 'axios';
import Style from './deleteGoal.module.scss';
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';

export default function DeleteGoal(props) {
	console.log(props.goals);

	async function deleteGoal(e) {
		e.preventDefault();
		const goalsToDelete = props.goals.filter((goal) => goal.name === props.name);
		let idsToDelete = goalsToDelete.map((goal) => goal._id);
		console.log(idsToDelete);
		try {
			let requests = [];
			for (let i in idsToDelete) {
				const id = idsToDelete[i];
				const request = axios.delete(`http://localhost:10000/goals/${id}`);
				requests.push(request);
			}
			await Promise.all(requests);
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
					<ThemeProvider theme={theme}>
						<Button className={Style.buttonsMUI} variant='outlined' onClick={props.unmount}>
							CANCEL
						</Button>
						<Button className={Style.buttonsMUI} variant='contained' color='warning' onClick={deleteGoal}>
							DELETE
						</Button>
					</ThemeProvider>
				</div>
			</div>
		</div>
	);
}
