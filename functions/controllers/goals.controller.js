const Models = require('../models');
const Goal = Models.Goal;

const handleError500 = (err) => {
	res.status(500).send({
		message: err.message || 'Error occured while creating the goal',
	});
};

// Create and Save a new Goal
exports.create = (req, res) => {
	// Validate request //Optional?
	// if (!req.body.name) {
	// 	res.status(400).send({ message: 'Content can not be empty!' });
	// 	return;
	// }

	// Create a Goal
	const goal = new Goal({
		name: req.body.name,
		category: req.body.category,
		timesPerWeek: req.body.timesPerWeek,
		days: req.body.days
	});

	// Save Goal in the database
	goal.save(goal)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => handleError500(err));
};

// Retrieve all Goals from the database.
exports.findAll = (req, res) => {
	const name = req.body.name;
	const category = req.body.category;
	var condition = name
		? { name: { $regex: new RegExp(name), $options: 'i' } }
		: category
		? { category: category }
		: {};

	Goal.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving goals.',
			});
		});
};

// Find a single Goal with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	Goal.findById(id)
		.then((data) => {
			if (!data) res.status(404).send({ message: 'Not found Goal with id ' + id });
			else res.send(data);
		})
		.catch((err) => {
			res.status(500).send({ message: 'Error retrieving Goal with id=' + id });
		});
};

// Update a Goal by the id in the request
exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'Data to update can not be empty!',
		});
	}

	const id = req.params.id;

	Goal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Goal with id=${id}. Maybe Goal was not found!`,
				});
			} else res.send({ message: 'Goal was updated successfully.' });
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Goal with id=' + id,
			});
		});
};

// Delete a Goal with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Goal.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Goal with id=${id}. Maybe Goal was not found!`,
				});
			} else {
				res.send({
					message: 'Goal was deleted successfully!',
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete Goal with id=' + id,
			});
		});
};

// Delete all Goals from the database.
exports.deleteAll = (req, res) => {
	Goal.deleteMany({})
		.then((data) => {
			res.send({
				message: `${data.deletedCount} Goals were deleted successfully!`,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while removing all goals.',
			});
		});
};

// Find all published Goals
exports.findAllPublished = (req, res) => {
	Goal.find({ published: true })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving goals.',
			});
		});
};
