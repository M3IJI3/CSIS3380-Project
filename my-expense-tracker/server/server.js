const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser.json());

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// use routes
app.use('/api', userRoutes);

// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});