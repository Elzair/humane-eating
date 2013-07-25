#!/bin/sh
npm install
cp ./node_modules/fluidity/lib/fluidity.styl ./public/stylesheets
cp -R ./node_modules/fluidity/lib/fluidity ./public/stylesheets/
ender build jeesh reqwest
