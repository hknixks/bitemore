const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
const router = require('./routers')

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb'  }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const URL = process.env.MONGO_URI;


app.use('/api/v1', router);

mongoose.connect(URL)
    .then(() => {
        console.log('mongoose has connected successfully');
    }).catch((err) => {
        console.log(err);
    })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
