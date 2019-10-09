#!/bin/bash
npm run toasts:build
cd dist/toasts
tar -czvf toasts.tar.gz ./
cd ../..
npm publish --access=public ./dist/toasts/toasts.tar.gz
