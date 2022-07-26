const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goals.controller');
const categoriesController = require('../controllers/categories.controller')

router.get('/', (req, res) => {
	res.send('NIGGA WE MADE IT!!');
});

// -----> GOALS ROUTES

// GET /goals - get all goals OR search by name and/or category
router.get('/goals', goalsController.findAll);

// GET /goals/:id - get goal by id
router.get('/goals/:id', goalsController.findOne);

// POST /goals - add new goal
router.post('/goals', goalsController.create);

// PUT /goals/:id - update goal by id
router.put('/goals/:id', goalsController.update);

// DELETE /goals/:id - delete goal by id
router.delete('/goals/:id', goalsController.delete);

// DELETE /goals - delete all goals
router.delete('/goals', goalsController.deleteAll);

// -----> CATEGORY ROUTES

// POST /category - add new goal
router.post('/category', categoriesController.create);

// PUT /category/:id - update category by id
router.put('/category/:id', categoriesController.update);

// GET /category - get all categories OR search by name
router.get('/category', categoriesController.findAll);

// DELETE /category/:id - delete goal by id
router.delete('/category/:id', categoriesController.delete);

module.exports = router;