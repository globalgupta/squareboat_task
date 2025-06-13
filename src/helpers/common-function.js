const helper = require('../helpers/api-response');
const { body, query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


exports.validateRequest = async (req, res, next) => {
    const result = validationResult(req, res, next)
    if (!result.isEmpty()) {
        return helper.validationErrorWithData(res, result.array()[1]?.msg ?? result.array()[0].msg, result.array());
    }
    next();
};

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

exports.generateToken = async (userId) => {
    return JWT.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
};





