import React, { useState, useRef } from 'react';
import Style from './loadingDots.module.scss';

export default function LoadingDots(props) {
	return (
		<div className={Style.LoadingDots}>
			<p>Loading</p>
			<div className={Style.Spinner}>
				<div className={Style.Bounce1}></div>
				<div className={Style.Bounce2}></div>
				<div className={Style.Bounce3}></div>
			</div>
		</div>
	);
}
