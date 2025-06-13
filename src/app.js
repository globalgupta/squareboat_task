const express = require('express');
const app = express();
require('dotenv').config();
require('./config/db-connection');

app.use(express.json());

const recruiterRoutes = require('./routes/recruiter-route');
app.use('/api/v1', recruiterRoutes);

const candidateRoutes = require('./routes/candidate-route');
app.use('/api/v1', candidateRoutes);


const port = process.env.PORT || 3000;
app.listen(port, async () => console.log(`App is listening at port: ${port}`));

