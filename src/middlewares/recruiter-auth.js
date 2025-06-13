const JWT = require('jsonwebtoken');
const helper = require('../helpers/api-response');
const RECRUITER = require('../models/recruiter-model');
const { validationMessage } = require('../helpers/constant');


const validateRecruiter = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return helper.errorResponse(res, validationMessage.NO_TOKEN_FOUND);

        const verifyToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        if (!verifyToken) return helper.errorResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        const recruiterData = await RECRUITER.findOne({ _id: verifyToken?.userId });
        if (!recruiterData) return helper.unAuthorizedResponse(res, validationMessage.UNAUTHORIZED_TOKEN);

        req.currentUser = recruiterData;
        next();
    }
    catch (err) {
        console.log('catched errorrrrrrrrrrrrr', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
}


module.exports = { validateRecruiter };