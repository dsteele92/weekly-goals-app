const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
// console.log(process.env)
const port = process.env.PORT || 5000;
const goalsController = require('./controllers/goals.controller');
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route

// app.use(require('./routes/record'));

// const Goal = require('./models/goal');

const mongoose = require('mongoose');
mongoose
	.connect(process.env.ATLAS_URI, { dbName: 'weekly_goals_app', useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MONGOOSE IN THIS BITCH');
		// console.log(process.env);
	})
	.catch((err) => {
		console.log('MONGOOSE DONE FUCKED UP');
		console.log(err);
	});

// --> Import all models
const Models = require('./models');

// GET /goals - get all goals
// GET /goals/:id - get goal by id
// POST /goals - add new goal
// PUT /goals/:id - update goal by id
// DELETE /goals/:id - delete goal by id
// DELETE /goals - delete all goals
// GET /goals?title=[kw] - find all goals which title contains 'kw'

// GET home page
app.get('/', (req, res) => {
	res.send('NIGGA WE MADE IT!!');
});

// GET /goals - get all goals
// can add name query to find by name
app.get('/goals', goalsController.findAll);

// app.get('/goals', async (req, res) => {
// 	const goals = await Models.Goal.find({});
// 	res.send(goals);
// });

// GET /goals/:id - get goal by id
app.get('/goals/:id', goalsController.findOne);

// POST /goals - add new goal
app.post('/goals', goalsController.create);

// PUT /goals/:id - update goal by id
app.put('/goals/:id', goalsController.update);

// DELETE /goals/:id - delete goal by id
app.delete('/goals/:id', goalsController.delete);

// DELETE /goals - delete all goals
app.delete('/goals', goalsController.deleteAll);

// GET /goals?title=[kw] - find all goals which title contains 'kw'

app.listen(port, () => {
	// perform a database connection when server starts
	// dbo.connectToServer(function (err) {
	// 	if (err) console.error(err);
	// });
	console.log(`Server is running on port: ${port}`);
	// console.log(process.env);
});
