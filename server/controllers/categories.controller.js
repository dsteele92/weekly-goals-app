const Models = require('../models');
const Category = Models.Category;

const handleError500 = (err) => {
	res.status(500).send({
		message: err.message || 'Error occured while creating the category',
	});
};

exports.create = (req, res) => {
	// Validate request //Optional?
	// if (!req.body.name) {
	// 	res.status(400).send({ message: 'Content can not be empty!' });
	// 	return;
	// }

	// Create a Goal
	const category = new Category({
		name: req.body.name,
        color: req.body.color
	});

	// Save Goal in the database
	category.save(category)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => handleError500(err));
};

exports.findAll = (req, res) => {
	const name = req.body.name;
	const color = req.body.color;
	var condition = name
		? { name: { $regex: new RegExp(name), $options: 'i' } }
		: color
		? { color: color }
		: {};

	Category.find(condition)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving categories.',
			});
		});
};

exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: 'Data to update can not be empty!',
		});
	}

	const id = req.params.id;

	Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot update Category with id=${id}. Maybe Category was not found!`,
				});
			} else res.send({ message: 'Category was updated successfully.' });
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Category with id=' + id,
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.id;

	Category.findByIdAndRemove(id, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot delete Category with id=${id}. Maybe Goal was not found!`,
				});
			} else {
				res.send({
					message: 'Category was deleted successfully!',
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete Category with id=' + id,
			});
		});
};