import React from 'react';
import Style from './setUp.module.scss';

export default function SetUp() {
	return (
		<div className={Style.modalContainer}>
			<div className={Style.centerModal}>
				<h1>Get Started</h1>
				<div className={Style.slideContainer}>
					<button className={Style.slideButtonOne}>Set Weekly Goals</button>
				</div>
				<div className={Style.slideContainer}>
					<button className={Style.slideButtonTwo}>Set Schedule</button>
				</div>
			</div>
		</div>
	);
}
