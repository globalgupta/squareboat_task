const helper = require('../helpers/api-response');
const { body, query, validationResult, header } = require('express-validator');
const commonFunction = require('../helpers/common-function');
const { validationMessage } = require('../helpers/constant');
const RECRUITER = require('../models/recruiter-model');
const JOB = require('../models/job-model');
const APPLIEDJOB = require('../models/applied-job-model');
const mongoose = require('mongoose');


exports.recruiterRegistration = [
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await RECRUITER.findOne({ email });
            if (checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_ALREADY_EXIST);
            }

            const payload = {
                email,
                password: await commonFunction.hashPassword(password)
            }

            const createRecruiter = await RECRUITER.create(payload);

            const token = await commonFunction.generateToken(createRecruiter._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { recruiterData: createRecruiter, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.recruiterLogin = [
    body('email').trim().isString().notEmpty().withMessage(validationMessage.EMAIL_REQUIRED)
        .isEmail().withMessage(validationMessage.INVALID_EMAIL),
    body('password').trim().isString().notEmpty().withMessage(validationMessage.PASSWORD_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { password } = req.body;
            const email = req.body?.email.toLowerCase();

            const checkEmailExist = await RECRUITER.findOne({ email });
            if (!checkEmailExist) {
                return helper.errorResponse(res, validationMessage.EMAIL_NOT_EXIST);
            }

            const verifyPassword = await commonFunction.comparePassword(password, checkEmailExist.password);
            if (!verifyPassword) {
                return helper.errorResponse(res, validationMessage.INCORRECT_PASSWORD);
            }

            const token = await commonFunction.generateToken(checkEmailExist._id);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, { recruiterData: checkEmailExist, token: token });
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.postJob = [
    body('title').trim().isString().notEmpty().withMessage(validationMessage.JOB_TITLE_REQUIRED),
    body('description').trim().isString().notEmpty().withMessage(validationMessage.JOB_DESCRIPTION_REQUIRED),
    commonFunction.validateRequest,     //middleware to validate input request
    async (req, res) => {
        try {
            const { title, description } = req.body;

            const refData = {
                recruiter_id: req.currentUser?._id,
                title,
                description
            }

            const createJob = await JOB.create(refData);

            return helper.successResponseWithData(res, validationMessage.REGISTRATION_SUCCEESS, createJob);
        }
        catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];


exports.candidateAppliedOnJobListing = [
    query('job_id').trim().isString().notEmpty().withMessage(validationMessage.JOB_ID_REQUIRED),
    commonFunction.validateRequest,
    async (req, res) => {
        try {
            const { job_id } = req.query;

            const findJob = await JOB.findOne({ _id: new mongoose.Types.ObjectId(job_id) });
            if (!findJob) {
                return helper.errorResponse(res, validationMessage.DATA_NOT_EXIST);
            }
            console.log('ppp', findJob)

            const jobData = await APPLIEDJOB.aggregate([
                {
                    $match: { job_id: findJob?._id }
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
                },
                {
                    $lookup: {
                        from: 'candidates',
                        localField: 'candidate_id',
                        foreignField: '_id',
                        as: 'candidate_details'
                    }
                },
                {
                    $unwind: '$candidate_details'
                }
            ]);

            return helper.successResponseWithData(res, validationMessage.DATA_SUCCEESS, jobData);
        } catch (err) {
            console.log('catch block error ===>>>>', err);
            return helper.catchedErrorResponse(res, validationMessage.INTERNAL_SERVER_ERROR, err.message);
        }
    }
];

