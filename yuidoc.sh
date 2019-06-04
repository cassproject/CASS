apt install nodejs npm
npm -g install yuidocjs 
npm install yuidoc-ember-cli-theme
mkdir docs
yuidoc -c yuidoc.json -o docs -e .js src/main/js
