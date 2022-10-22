module.exports = {
	url:
		process.env.NODE_ENV === 'production'
			? 'https://us-central1-weekly-goals-app.cloudfunctions.net/app'
			: 'http://localhost:10000',
};
