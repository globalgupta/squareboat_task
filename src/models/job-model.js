const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    recruiter_id: {
        type: mongoose.Types.ObjectId,
        ref: 'recruiters'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamp: true });

module.exports = mongoose.model('jobs', jobSchema);