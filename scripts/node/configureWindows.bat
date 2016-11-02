@echo off
echo You will need node and npm. Download the latest versions if this stuff fails.
echo You will also need an admin-level cmd prompt.
pause
npm install --global --production windows-build-tools
npm -g install npm@next
npm install node-jquery-xhr
npm install node-forge
npm install form-data
npm install antlr4
npm install papaparse