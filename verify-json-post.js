// Simple test script to verify if POST requests with application/json content-type
// are being handled correctly
const http = require('http');

function sendJsonPost() {
  const data = JSON.stringify({
    test: 'data',
    message: 'Testing JSON POST handling'
  });

  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/ping',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  console.log('Sending POST request with application/json content-type...');
  
  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Headers:', res.headers);
      try {
        const parsedData = JSON.parse(responseData);
        console.log('Response Body:', JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.log('Response Body (not JSON):', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error during request:', error);
  });

  req.write(data);
  req.end();
}

sendJsonPost();