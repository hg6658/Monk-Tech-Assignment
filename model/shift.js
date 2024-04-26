const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    timezone: {
        type: String,
        required: true
    }
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
