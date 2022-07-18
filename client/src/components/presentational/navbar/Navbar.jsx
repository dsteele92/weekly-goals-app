import React from 'react';
import { Link } from 'react-router-dom';

import Style from './navbar.module.scss';

export default function Navbar() {
	return (
		<nav>
			<div>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/edit'>Edit Goals</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
