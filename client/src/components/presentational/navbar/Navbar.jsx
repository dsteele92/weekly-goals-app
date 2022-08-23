import { React, useState } from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';
// Material UI:
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
// import { Avatar } from '@mui/material';

export default function Navbar() {
	const [collapse, setCollapse] = useState(false);

	return (
		<nav className={Style.Wrapper}>
			<div className={Style.Overlay}>
				<div className={Style.Inner}>
					<ul>
						<li className={Style.MobileNavbar}>
							<div className={Style.Collapse} onClick={() => setCollapse(!collapse)}>
								<span>
									<DensityMediumIcon fontSize='medium' />
								</span>
							</div>
						</li>
						<li className={collapse ? Style.FullNavbarCollapse : Style.FullNavbar}>
							<Link to='/'>
								<div className={Style.OutIn}>
									<span>
										<HomeOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Home</p>
							</Link>
						</li>
						<li className={collapse ? Style.FullNavbarCollapse : Style.FullNavbar}>
							<Link to='/edit'>
								<div className={Style.Slide}>
									<span>
										<EditOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Edit</p>
							</Link>
						</li>
						<li className={collapse ? Style.FullNavbarCollapse : Style.FullNavbar}>
							<Link to='/schedule'>
								<div className={Style.Collapse}>
									<span>
										<CalendarMonthOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Schedule</p>
							</Link>
						</li>
						{/* <li className={Style.Avatar}>
							<Avatar alt='Dalton Steele' src='' />
						</li> */}
					</ul>
				</div>
			</div>
		</nav>
	);
}
