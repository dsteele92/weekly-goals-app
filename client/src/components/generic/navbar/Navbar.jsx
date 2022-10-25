import { React, useState } from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';
import { Instructions } from 'components';
// Material UI:
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
// import { Avatar } from '@mui/material';

export default function Navbar() {
	const [collapse, setCollapse] = useState(false);
	const [help, setHelp] = useState(false);

	function handleHelpUnmount() {
		setHelp(false);
	}

	return (
		<div className={Style.Page}>
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
							<li className={collapse ? Style.HelpCollapse : Style.Help} onClick={() => setHelp(true)}>
								<div className={Style.OutIn}>
									<span>
										<QuestionMarkOutlinedIcon fontSize='large' />
									</span>
								</div>
								<p>Help</p>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			{help && <Instructions unmount={handleHelpUnmount} />}
		</div>
	);
}
