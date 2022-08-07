import React from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';
// Material UI:
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Avatar } from '@mui/material';

export default function Navbar() {
	return (
		<nav className={Style.Wrapper}>
			<div className={Style.Overlay}>
				<div className={Style.Inner}>
					<ul>
						<li>
							<Link to='/'>
								<div className={Style.outIn}>
									<span>
										<HomeOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Home</p>
							</Link>
						</li>
						<li>
							<Link to='/edit'>
								<div className={Style.slide}>
									<span>
										<EditOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Edit</p>
							</Link>
						</li>
						<li>
							<Link to='/schedule'>
								<div className={Style.collapse}>
									<span>
										<CalendarMonthOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Schedule</p>
							</Link>
						</li>
						<li className={Style.Avatar}>
							<Avatar alt='Dalton Steele' src='' />
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
