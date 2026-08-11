const http = require('http');

const options = {
  hostname: process.env.TEST_HOST || 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', error => {
  console.error(error);
  process.exit(1);
});

req.write(JSON.stringify({
  email: process.env.TEST_EMAIL || 'admin@kitchenhearth.com',
  password: process.env.TEST_PASSWORD || ''
}));
req.end();

