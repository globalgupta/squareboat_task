const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate-controller');
const { validateCandidate } = require('../middlewares/candidate-auth');


router.post('/candidate-registration', candidateController.candidateRegistration);
router.post('/candidate-login', candidateController.candidateLogin);
router.get('/job-listing', candidateController.jobListing);
router.post('/apply-job', validateCandidate, candidateController.applyJob);
router.get('/applied-job-listing', validateCandidate, candidateController.appliedJobListing);
router.post('/candidate-logout', validateCandidate, candidateController.candidateLogout);

module.exports = router;