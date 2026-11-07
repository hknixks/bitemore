const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config();

// Fail loudly at startup instead of failing on the first login.
const required = ['SECRET', 'MONGO_URI'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}
['PAYSTACK_SECRET_KEY', 'ADMIN_SIGNUP_CODE'].forEach((name) => {
    if (!process.env[name]) console.warn(`${name} is not set (payments / admin signup will not work until it is)`);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const URL = process.env.MONGO_URI;

mongoose.connect(URL)
    .then(() => {
        console.log('mongoose has connected successfully');
    }).catch((err) => {
        console.log(err);
    })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
