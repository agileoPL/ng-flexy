#!/bin/bash
npm run freezer:build
cd dist/freezer
tar -czvf freezer.tar.gz ./
cd ../..
npm publish --access=public ./dist/freezer/freezer.tar.gz
