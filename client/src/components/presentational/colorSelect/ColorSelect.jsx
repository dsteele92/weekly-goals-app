import React, { useState } from 'react';
import axios from 'axios';
import Style from './colorSelect.module.scss';
import { FormControl, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme.js';
import * as backend from '../../../backendURL.js';

export default function ColorSelect(props) {
	const [categoryInput, setCategoryInput] = useState('');
	const [selectedColor, setSelectedColor] = useState(0);

	async function setColor() {
		if (selectedColor === 0) return;
		const request = await axios({
			method: 'put',
			url: `${backend.url}/category/${categoryInput}`,
			data: { color: selectedColor },
		});
		console.log(request);
		setCategoryInput('');
		setSelectedColor(0);
		props.rerenderList();
	}

	return (
		<div className={Style.colorSelect}>
			<h2 className={Style.header}>Select Category Colors</h2>
			<ThemeProvider theme={theme}>
				<FormControl fullWidth margin='dense'>
					<InputLabel id='category'>Select Category</InputLabel>
					<Select
						color='secondary'
						labelId='category'
						id='category'
						variant='outlined'
						label='Select a Category'
						value={categoryInput}
						onChange={(e) => setCategoryInput(e.target.value)}>
						{props.categories.map((cat) => (
							<MenuItem key={cat._id} value={cat._id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<div className={Style.colorList}>
					<div className={selectedColor === 1 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption1}
							onClick={() => {
								selectedColor === 1 ? setSelectedColor(0) : setSelectedColor(1);
							}}></div>
					</div>
					<div className={selectedColor === 2 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption2}
							onClick={() => {
								selectedColor === 2 ? setSelectedColor(0) : setSelectedColor(2);
							}}></div>
					</div>
					<div className={selectedColor === 3 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption3}
							onClick={() => {
								selectedColor === 3 ? setSelectedColor(0) : setSelectedColor(3);
							}}></div>
					</div>
					<div className={selectedColor === 4 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption4}
							onClick={() => {
								selectedColor === 4 ? setSelectedColor(0) : setSelectedColor(4);
							}}></div>
					</div>
					<div className={selectedColor === 5 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption5}
							onClick={() => {
								selectedColor === 5 ? setSelectedColor(0) : setSelectedColor(5);
							}}></div>
					</div>
					<div className={selectedColor === 6 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption6}
							onClick={() => {
								selectedColor === 6 ? setSelectedColor(0) : setSelectedColor(6);
							}}></div>
					</div>
					<div className={selectedColor === 7 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption7}
							onClick={() => {
								selectedColor === 7 ? setSelectedColor(0) : setSelectedColor(7);
							}}></div>
					</div>
					<div className={selectedColor === 8 ? Style.selected : Style.unselected}>
						<div
							className={Style.colorOption8}
							onClick={() => {
								selectedColor === 8 ? setSelectedColor(0) : setSelectedColor(8);
							}}></div>
					</div>
				</div>
				<Button variant='outlined' fullWidth onClick={setColor}>
					Set
				</Button>
			</ThemeProvider>
		</div>
	);
}
