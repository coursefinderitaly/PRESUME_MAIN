const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/payment/history?email=test@test.com', // Change this if you want
  method: 'GET',
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
});

req.on('error', error => console.error(error));
req.end();
