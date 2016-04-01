#!/bin/bash
set -x
cd webapp
npm install
./node_modules/bower/bin/bower install
./node_modules/grunt-cli/bin/grunt build:$BUILD_TARGET