const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: Number,
        default: 0
    }
})

const Category = mongoose.model('Category', { name: String, color: Number });

module.exports = Category;