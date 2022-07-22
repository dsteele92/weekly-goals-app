const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
		// enum: ['Fitness', 'Nutrition', 'Mindfulness'],
	},
	day: {
		type: String,
		enum: ['unassigned', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
	},
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
