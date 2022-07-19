import React from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';

export default function Navbar() {
	return (
		<nav className={Style.Wrapper}>
			<div className={Style.Inner}>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/edit'>Edit</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
