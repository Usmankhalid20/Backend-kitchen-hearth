const http = require('http');
const https = require('https');
const env = require('../config/env');

const startKeepAlive = () => {
    const ping = () => {
        const baseUrl = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL || `http://127.0.0.1:${env.PORT}`;
        const targetUrl = `${baseUrl.replace(/\/$/, '')}/health`;

        const client = targetUrl.startsWith('https') ? https : http;

        client.get(targetUrl, (res) => {
            console.log(`[Keep-Alive] GET ${targetUrl} - Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`[Keep-Alive] Ping failed: ${err.message}`);
        });

        // Schedule next random GET request between 5 and 10 minutes (300,000ms - 600,000ms)
        const randomMinutes = Math.floor(Math.random() * 6) + 5; // 5 to 10 minutes
        const randomDelay = randomMinutes * 60 * 1000;
        console.log(`[Keep-Alive] Next GET ping scheduled in ${randomMinutes} minutes`);
        setTimeout(ping, randomDelay);
    };

    // First ping 5 minutes after server start
    const initialDelay = 5 * 60 * 1000;
    setTimeout(ping, initialDelay);
};

module.exports = startKeepAlive;
