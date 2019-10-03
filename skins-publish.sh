#!/bin/bash
npm run skins:build
cd dist/skins
tar -czvf skins.tar.gz ./
cd ../..
npm publish --access=public ./dist/skins/skins.tar.gz
