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
      
      // Log success confirmation
      console.log('\nTest result:');
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('\x1b[32m%s\x1b[0m', 'SUCCESS: JSON POST request was handled correctly');
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'FAILURE: JSON POST request failed');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error during request:', error);
    console.log('\x1b[31m%s\x1b[0m', 'FAILURE: Request error occurred');
  });

  req.write(data);
  req.end();
}

testJsonPost();