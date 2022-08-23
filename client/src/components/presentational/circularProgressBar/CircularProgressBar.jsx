import React, { useState, useRef } from 'react';
import Style from './circularProgressBar.module.scss';

export default function CircularProgressBar(props) {
	// const [progressValue, setProgressValue] = useState(0);
	const progressValue = useRef();
	const circularProgress = useRef();

	const total = props.goals.length;
	const completed = props.goals.filter((goal) => goal.completed).length;

	let progressStartValue = 0;
	const progressEndValue = Math.round((completed / total) * 100);
	const speed = 5;

	if (progressEndValue > 0) {
		let progress = setInterval(() => {
			progressStartValue++;
			progressValue.current.textContent = `${progressStartValue}%`;
			circularProgress.current.style.background = `conic-gradient(#dbdbdb ${
				progressStartValue * 3.6
			}deg, #ededed 0deg)`;

			if (progressStartValue === progressEndValue) {
				clearInterval(progress);
			}
			// console.log(progressStartValue);
		}, speed);
	} else if (progressEndValue === 0) {
		let progress = setInterval(() => {
			progressValue.current.textContent = '0%';
			circularProgress.current.style.background = '#ededed';
			clearInterval(progress);
		}, speed);
		// progressValue.current.textContent = '0%';
		// circularProgress.current.style.background = `conic-gradient(#dbdbdb 0deg, #ededed 0deg)`;
	}

	return (
		<div>
			<div className={Style.progressContainer}>
				<div className={Style[`circularProgress${props.category.color}`]} ref={circularProgress}>
					<span className={Style.progressValue} ref={progressValue}>
						0%
					</span>
				</div>

				<span className={Style.text}>{props.category.name}</span>
			</div>
		</div>
	);
}
