import React from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';
// Material UI:
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar } from '@mui/material';

export default function Navbar() {
	return (
		<nav className={Style.Wrapper}>
			<div className={Style.Inner}>
				<ul>
					<li>
						<Link to='/'>
							<div>
								<HomeOutlinedIcon fontSize='large' />
								<p>Home</p>
							</div>
						</Link>
					</li>
					<li>
						<Link to='/edit'>
							<div>
								<EditOutlinedIcon fontSize='large' />
								<p>Edit</p>
							</div>
						</Link>
					</li>
					<li className={Style.Avatar}>
						<Avatar alt='Dalton Steele' src='' />
					</li>
				</ul>
			</div>
		</nav>
	);
}
