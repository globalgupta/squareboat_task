const JWT = require('jsonwebtoken');
const helper = require('../helpers/api-response');
const CANDIDATE = require('../models/candidate-model');
const AUTHTOKEN = require('../models/auth-token-model');
const { validationMessage } = require('../helpers/constant');


const validateCandidate = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return helper.errorResponse(res, validationMessage.NO_TOKEN_FOUND);

        const verifyToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        if (!verifyToken) return helper.errorResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        const candidateData = await CANDIDATE.findOne({ _id: verifyToken.userId });
        if (!candidateData) return helper.unAuthorizedResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        const findToken = await AUTHTOKEN.findOne({ token: token });
        if (!findToken) return helper.errorResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        req.currentUser = candidateData;
        next();
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
}


module.exports = { validateCandidate };