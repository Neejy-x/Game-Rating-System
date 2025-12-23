const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
})

const Review = mongoose.model('Review', reviewSchema)