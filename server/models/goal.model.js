const mongoose = require('mongoose');

// On SCHEDULE page:
// create an array as local state for each goal
// on drag/drop remove/push days(0-6) in and out of the array
// update the array on save

const goalSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	timesPerWeek: {
		type: Number,
		required: true
	},
	days: Object
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
