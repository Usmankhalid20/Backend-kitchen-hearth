const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const startKeepAlive = require('./src/utils/keepAlive');

connectDB().then(() => {
    app.listen(env.PORT, () => {
        console.log(`Server is running on ports ${env.PORT}`);
        startKeepAlive();
    });
});
