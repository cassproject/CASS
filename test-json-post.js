// Run this with: node test-json-post.js
// NOTE: Need to first run the server with: npm run dev:node

const http = require('http');

function testJsonPost() {
  const data = JSON.stringify({
    test: 'data',
    message: 'This is a test of the JSON POST endpoint'
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

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Headers:', res.headers);
      console.log('Response Body:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Error during request:', error);
  });

  req.write(data);
  req.end();
}

testJsonPost();