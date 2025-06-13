const mongoose = require('mongoose');

const appliedJobSchema = mongoose.Schema({
    candidate_id: {
        type: mongoose.Types.ObjectId,
        ref: 'candidates'
    },
    job_id: {
        type: mongoose.Types.ObjectId,
        ref: 'jobs'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamp: true });

module.exports = mongoose.model('appliedjobs', appliedJobSchema);