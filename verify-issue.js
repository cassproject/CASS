// Issue verification script
// This script analyzes the levr.js file to verify that POST requests with application/json
// content-type are being redirected to the PUT handler

const fs = require('fs');
const path = require('path');

// Path to the source file
const sourceFilePath = path.join(__dirname, 'src/main/server/shims/levr.js');

// Read the file
console.log(`Reading file: ${sourceFilePath}`);
const fileContent = fs.readFileSync(sourceFilePath, 'utf8');

// Check for the issue using a simple string search, which is more reliable
console.log('Checking for redirection of JSON POST requests to PUT handler...');

// Look for the exact code pattern that indicates the issue
const redirectionExists = fileContent.includes("if (req.headers['content-type'] == 'application/json') {") && 
                         fileContent.includes("return await put(req, res);");

if (redirectionExists) {
  console.log('\x1b[31m%s\x1b[0m', 'ISSUE VERIFIED: The code redirects POST requests with application/json content-type to the PUT handler');
  
  // Show the relevant part of the code
  console.log('\nRelevant code snippet:');
  
  // Get a few lines around the issue
  const lines = fileContent.split('\n');
  let issueLineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("if (req.headers['content-type'] == 'application/json')")) {
      issueLineIndex = i;
      break;
    }
  }
  
  if (issueLineIndex !== -1) {
    // Show 5 lines before and after the issue
    const startLine = Math.max(0, issueLineIndex - 5);
    const endLine = Math.min(lines.length - 1, issueLineIndex + 5);
    
    console.log('\x1b[33m%s\x1b[0m', lines.slice(startLine, endLine + 1).join('\n'));
  }
  
  console.log('\nThis confirms the issue: JSON POST requests are not handled natively as POST requests.');
  console.log('Instead, they are incorrectly redirected to the PUT handler.');
} else {
  console.log('\x1b[32m%s\x1b[0m', 'No issue found: The code does not redirect POST requests with application/json content-type to the PUT handler');
}