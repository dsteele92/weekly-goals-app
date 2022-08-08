import React, { useState } from 'react';
import axios from 'axios';
import Style from './updateGoal.module.scss';

export default function UpdateGoal(props) {
	const isCustom = !(
		props.category === 'Fitness' ||
		props.category === 'Nutrition' ||
		props.category === 'Mindfulness'
	);

	const [nameInput, setNameInput] = useState(props.name);
	const [categoryInput, setCategoryInput] = useState(isCustom ? 'Custom' : props.category);
	const [customCategoryInput, setCustomCategoryInput] = useState(isCustom ? props.category : '');
	const [timesPerWeek, setTimesPerWeek] = useState(props.timesPerWeek);

	const [customCategory, setCustomCategory] = useState(isCustom);

	async function updateGoal(e) {
		e.preventDefault();
		const goalsToUpdate = props.goals.filter((goal) => goal.name === props.name);
		let idsToUpdate = goalsToUpdate.map((goal) => goal._id);
		let data = {
			name: nameInput,
			category: customCategory ? customCategoryInput : categoryInput,
		};
		try {
			let requests = [];
			for (let i in idsToUpdate) {
				const id = idsToUpdate[i];
				const request = await axios({
					method: 'put',
					url: `http://localhost:10000/goals/${id}`,
					data: data,
				});
				requests.push(request);
			}
			if (customCategory) {
				if (!props.allCategories.includes(customCategoryInput)) {
					const categoryUpdate = await axios({
						method: 'post',
						url: 'http://localhost:10000/category',
						data: { name: `${customCategoryInput}`, color: 0 },
					});
					requests.push(categoryUpdate);
				}
			}
			Promise.all(requests);
			console.log(`GOAL UPDATED`);
			props.rerenderList();
			props.unmount();
		} catch (e) {
			console.log(e);
		}
	}

	async function updateAmount(e) {
		e.preventDefault();
		if (timesPerWeek > props.timesPerWeek) {
			console.log('greater than');
		} else if (timesPerWeek < props.timesPerWeek) {
			console.log('less than');
			// select which ones to delete
		} else {
			props.unmount();
		}
	}

	function onCategoryChange(e) {
		setCategoryInput(e.target.value);
		e.target.value === 'Custom' ? setCustomCategory(true) : setCustomCategory(false);
		console.log(e.target.value);
	}

	return (
		<div className={Style.modalBackground}>
			<div className={Style.modal}>
				<h2 className={Style.updateH2}>Update Goal</h2>
				<div className={Style.exitButton} onClick={props.unmount}>
					X
				</div>
				<form className={Style.form}>
					<div>
						<label htmlFor='goal'>Goal</label>
						<input
							type='text'
							name='goal'
							id='goal'
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor='category'>Category</label>
						<select name='category' id='category' value={categoryInput} onChange={onCategoryChange}>
							<option value=''>--Select--</option>
							<option value='Fitness'>Fitness</option>
							<option value='Nutrition'>Nutrition</option>
							<option value='Mindfulness'>Mindfulness</option>
							{props.categories
								.filter((cat) => !cat === 'Fitness' || !cat === 'Nutrition' || !cat === 'Mindfulness')
								.map((cat, index) => (
									<option value={cat} key={index}>
										{cat}
									</option>
								))}
							<option value='Custom'>Custom</option>
						</select>
					</div>
					{customCategory === true ? (
						<div className={Style.customCategory}>
							<input
								type='text'
								name='category'
								id='category'
								placeholder='Enter Custom Category'
								value={customCategoryInput}
								onChange={(e) => setCustomCategoryInput(e.target.value)}
							/>
						</div>
					) : (
						''
					)}
					<button onClick={updateGoal}>Submit</button>
				</form>
				<h2 className={Style.updateH2}>Update Amount</h2>
				<form className={Style.form}>
					<div>
						<label htmlFor='times'>Times per week</label>
						<input
							type='number'
							id='times'
							value={timesPerWeek}
							onChange={(e) => setTimesPerWeek(e.target.value)}
						/>
					</div>
					<button onClick={updateAmount}>Submit</button>
				</form>
			</div>
		</div>
	);
}
