const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_LOCAL_URI);
mongoose.connection.once('open', (err) => err ? console.log('Database is not connected') : console.log('Database is connected...'));