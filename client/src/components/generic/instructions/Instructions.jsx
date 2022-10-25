import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Style from './instructions.module.scss';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export default function Instructions(props) {
	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<div className={Style.exitButton} onClick={props.unmount}>
					X
				</div>
				<div className={Style.instructions}>
					<h1>Instructions:</h1>
					<div className={Style.page}>
						<Link to='/edit' onClick={props.unmount}>
							<EditOutlinedIcon />
						</Link>
						<Link to='/edit' onClick={props.unmount}>
							<ul>
								<li>Add goals</li>
								<li>Select category and times per week</li>
								<li>Customize colors for each category</li>
							</ul>
						</Link>
					</div>
					<div className={Style.page}>
						<Link to='/schedule' onClick={props.unmount}>
							<CalendarMonthOutlinedIcon />
						</Link>
						<Link to='/schedule' onClick={props.unmount}>
							<ul>
								<li>Schedule goals by weekday</li>
							</ul>
						</Link>
					</div>
					<div className={Style.page}>
						<Link to='/' onClick={props.unmount}>
							<HomeOutlinedIcon />
						</Link>
						<Link to='/' onClick={props.unmount}>
							<ul>
								<li>Check boxes to mark goals as complete</li>
								<li>Track progress</li>
							</ul>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
