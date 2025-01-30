const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { SlidesSchema } = require('./slidesSchema');

/**
=========================== TcodeSchema =======================
*/
const TCodeSchema = new Schema({
    tcode: {
        type: String,
        default: "general",
        required: true
    },
    chapter: {
        type: Number,
        required: true
    },
    exercise: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    questionNo: {
        type: Number,
        required: false
    },
    part: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    questionType: {
        type: String,
        enum: ['paid', 'login', 'free'],
        required: true,
        default: 'paid'
    },
    status: {
        type: String,
        enum: ['empty', 'filled', 'locked', 'final'],
        required: true,
        default: 'empty'
    },
        slides: {
        type: [SlidesSchema],
        required: true,
        default : []
        },
    tags: {
        type: [String],
        default: [],
        required: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        required: true
    },
    comments: {
        type: String,
        default: "",
        required: false
    },
});

const Tcode = mongoose.model('Tcode', TCodeSchema);
module.exports = Tcode ;