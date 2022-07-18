const mongoose = require('mongoose');

// const CatSchema = new mongoose.Schema({ name: String });

const Cat = mongoose.model('Cat', { name: String });

module.exports = Cat;
