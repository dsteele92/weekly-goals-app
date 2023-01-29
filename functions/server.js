const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const port = process.env.PORT || 10000;
const functions = require('firebase-functions');

// --> Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose
	.connect(
		`mongodb+srv://dsteele92:${process.env.MONGO_PW}@mongocluster.p2pj1nj.mongodb.net/?retryWrites=true&w=majority`,
		{
			dbName: 'weekly_goals_app',
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('MONGOOSE RUNNING');
	})
	.catch((err) => {
		console.log('MONGOOSE ERROR');
		console.log(err);
	});

// --> Import all models
const Models = require('./models');

//  --> Import Router
const router = require('./routes/router.js');
app.use('/', router);

exports.app = functions.https.onRequest(app);

// app.listen(port, () => {
// 	// perform a database connection when server starts
// 	// dbo.connectToServer(function (err) {
// 	// 	if (err) console.error(err);
// 	// });
// 	console.log(`Server is running on port: ${port}`);
// 	// console.log(process.env);
// });
