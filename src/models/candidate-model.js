const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamp: true });

module.exports = mongoose.model('candidates', candidateSchema);