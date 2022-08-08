const mongoose = require('mongoose');

// On SCHEDULE page:
// create an array as local state for each goal
// on drag/drop remove/push days(0-6) in and out of the array
// update the array on save

const goalSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	day: {
		type: String,
		enum: ['unassigned', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		default: 'unassigned',
	},
	dayIndex: {
		type: Number,
		default: 0,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
