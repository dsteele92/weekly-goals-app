import React, { useState } from 'react';
import axios from 'axios';
import Style from './circularProgressBar.module.scss';

export default function CircularProgressBar(props) {
	return (
		<div>
			{props.goals.map((goal) => (
				<div>
					<div>{goal.name}</div>
					<h2>{goal.cat}</h2>
				</div>
			))}
		</div>
	);
}
