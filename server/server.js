const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

// --> Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose
	.connect(process.env.ATLAS_URI, { dbName: 'weekly_goals_app', useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MONGOOSE IN THIS BITCH');
	})
	.catch((err) => {
		console.log('MONGOOSE DONE FUCKED UP');
		console.log(err);
	});

// --> Import all models
const Models = require('./models');

//  --> Import Router
const router = require('./routes/router.js');
app.use('/', router);


app.listen(port, () => {
	// perform a database connection when server starts
	// dbo.connectToServer(function (err) {
	// 	if (err) console.error(err);
	// });
	console.log(`Server is running on port: ${port}`);
	// console.log(process.env);
});
