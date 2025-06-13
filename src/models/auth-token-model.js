const mongoose = require('mongoose');

const authTokenSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId
    },
    token: {
        type: String
    }
}, { timestamp: true });

module.exports = mongoose.model('authtokens', authTokenSchema);