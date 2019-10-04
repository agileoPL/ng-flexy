#!/bin/bash
ng build logger
cd dist/logger
tar -czvf logger.tar.gz ./
cd ../..
npm publish --access=public ./dist/logger/logger.tar.gz
