#!/bin/sh
styldir='public/stylesheets'
temps=''
fluidity='fluidity.styl'
imports=''
# Get list of all templates that need watching
cd $styldir
for i in $(ls *.styl)
do
  if [[ $i != $fluidity ]]
  then
    temps=$temps' '$styldir'/'$i
  fi
done
# Get list of all templates that need to be imported
for i in $(cat fluidity.styl | awk {'print $2'} | sed s/\"//g)
do
  imports=$imports' --import '$styldir'/'$i
done
# Compile CSS templates and run app with nodemon
cd ../../
options=$temps$imports
./node_modules/stylus/bin/stylus $options & nodemon app.js
