// Rewrites coverage/lcov.info source paths with forward slashes, so a report made on
// Windows matches the files when SonarCloud analyses the repository on Linux.
const fs = require('fs');
const file = process.argv[2] || 'coverage/lcov.info';
if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8').replace(/^SF:(.*)$/gm, (line, p) => 'SF:' + p.replace(/\\/g, '/'));
    fs.writeFileSync(file, text);
}
