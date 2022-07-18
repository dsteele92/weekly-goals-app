import React from 'react';
import Style from './editGoals.module.scss';

class EditGoals extends React.Component {
	constructor(props) {
		super(props);
		this.state = { apiResponse: '' };
	}

	callAPI() {
		fetch('http://localhost:10000/cats')
			.then((res) => res.text())
			.then((res) => this.setState({ apiResponse: res }))
			.catch((err) => err);
	}

	componentDidMount() {
		this.callAPI();
	}

	render() {
		return (
			<div>
				<h1>LIST OF CATS</h1>
				<p>{this.state.apiResponse}</p>
			</div>
		);
	}
}

export default EditGoals;

// export default function EditGoals() {}
