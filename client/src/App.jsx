import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import './App.scss';

import { Navbar } from 'components';
import { HomePage, EditPage, SchedulePage } from 'pages';

const App = () => {
	return (
		<div className='App'>
			<Router>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/edit' element={<EditPage />} />
					<Route path='/schedule' element={<SchedulePage />} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
