#!/bin/bash
ng build core
cd dist/core
tar -czvf core.tar.gz ./
cd ../..
npm publish --access=public ./dist/core/core.tar.gz
