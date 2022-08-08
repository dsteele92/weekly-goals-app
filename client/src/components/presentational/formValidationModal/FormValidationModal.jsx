import React from 'react';
import Style from './formValidationModal.module.scss';

export default function FormValidationModal(props) {
	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h2>Enter a goal and a category to submit</h2>
				<button className={Style.cancelButton} onClick={props.unmount}>
					Okay
				</button>
			</div>
		</div>
	);
}
