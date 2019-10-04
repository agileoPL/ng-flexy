#!/bin/bash
ng build storage
cd dist/storage
tar -czvf storage.tar.gz ./
cd ../..
npm publish --access=public ./dist/storage/storage.tar.gz
