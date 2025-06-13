const helper = require('../helpers/api-response');
const { body, query, validationResult, header } = require('express-validator');
const commonFunction = require('../helpers/common-function');
const { validationMessage } = require('../helpers/constant');
const CANDIDATE = require('../models/candidate-model');
const JOB = require('../models/job-model');
const APPLIEDJOB = require('../models/applied-job-model');


exports.candidateRegistration = [
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await CANDIDATE.findOne({ email });
            if (checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_ALREADY_EXIST);
            }

            const payload = {
                email,
                password: await commonFunction.hashPassword(password)
            }

            const createCandidate = await CANDIDATE.create(payload);

            const token = await commonFunction.generateToken(createCandidate._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { candidateData: createCandidate, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.candidateLogin = [
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await CANDIDATE.findOne({ email });
            if (!checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_NOT_EXIST);
            }

            const verifyPassword = await commonFunction.comparePassword(password, checkEmailExist.password);
            if (!verifyPassword) {
                return helper.errorResponse(res, validationMessage.INCORRECT_PASSWORD);
            }

            const token = await commonFunction.generateToken(checkEmailExist._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { candidateData: checkEmailExist, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.jobListing = async (req, res) => {
    try {
        const jobData = await JOB.find();

        return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, jobData);
    }
    catch (err) {
        console.log('catch block error ===>>>>', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
};


exports.applyJob = async (req, res) => {
    try {
        const { job_ids } = req.body;

        if (job_ids.length === 0) {
            return helper.errorResponse(res, validationMessage.JOB_ID_REQUIRED);
        }

        const findJob = await JOB.find({ _id: { $in: job_ids } });
        if (!findJob.length) {
            return helper.errorResponse(res, validationMessage.DATA_NOT_EXIST);
        }

        const payload = findJob.map(job => ({
            job_id: job._id,
            candidate_id: req.currentUser._id
        }));

        await APPLIEDJOB.insertMany(payload);

        return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS);
    }
    catch (err) {
        console.log('catch block error ===>>>>', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
};


exports.appliedJobListing = async (req, res) => {
    try {
        const jobData = await APPLIEDJOB.aggregate([
            {
                $match: { candidate_id: req.currentUser._id }
            },
            {
                $lookup: {
                    from: 'jobs',                 
                    localField: 'job_id',         
                    foreignField: '_id',          
                    as: 'job_details'             
                }
            },
            {
                $unwind: '$job_details'         
            }
        ]);

        return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, jobData);
    }
    catch (err) {
        console.log('catch block error ===>>>>', err);
        return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
    }
};
