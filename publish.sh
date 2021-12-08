#!/bin/bash

if [[ $# -eq 0 || ! -d "./projects/$1" ]]; then
  echo "Error: Wrong project name"
  exit
fi

npm run $1:build
node ci-scripts/publisher.js $1

cd dist/$1
#tar -czvf $1.tar.gz ./
#cd ../..
#npm publish --access=public ./dist/$1/$1.tar.gz
npm publish --access=public
#npm publish --access=public --tag alpha
cd ../..
