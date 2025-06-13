const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiter-controller');
const { validateRecruiter } = require('../middlewares/recruiter-auth');


router.post('/recruiter-registration', recruiterController.recruiterRegistration);
router.post('/recruiter-login', recruiterController.recruiterLogin);
router.post('/post-job', validateRecruiter, recruiterController.postJob);
router.get('/candidate-applied-job-listing', validateRecruiter, recruiterController.candidateAppliedOnJobListing);

module.exports = router;