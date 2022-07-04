import './App.scss';
import { SetUp } from './components';
import { Schedule } from './components';

import React from 'react';
// import { Route, Routes } from 'react-router-dom';

const App = () => {
	return (
		<div>
			<Schedule />
			{/* if weekly goals and/or schedule are not set, show: */}
			<SetUp />
		</div>
	);
};

export default App;
