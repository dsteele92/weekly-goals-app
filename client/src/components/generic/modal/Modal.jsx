import React from 'react';
import axios from 'axios';
import Style from './modal.module.scss';

export default function Modal(props) {
	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h2>{props.text}</h2>
			</div>
		</div>
	);
}
