#!/bin/bash

echo "[DEBUG] In setup.bash"

echo "[DEBUG] Checking versions..."
echo "npm version: `npm --version`"
echo "node version: `node --version`"

echo "[DEBUG] npm i --lockfile-version 3"
npm i --lockfile-version 3

echo "[DEBUG] FRONTEND SETUP"
cd frontend

echo "[DEBUG] Running 'npm install' in `pwd`:"
npm install

echo "[DEBUG] Running 'npm build' in `pwd`:"
npm run build

echo "[DEBUG] API SETUP"
cd ../api

echo "[DEBUG] Updating package lists via apt-get update..."
sudo apt-get update

echo "[DEBUG] Installing libsqlite3-dev"
sudo apt-get install libsqlite3-dev

echo "[DEBUG] Installing sqlite3 via npm 'npm install sqlite3 --build-from-source'"
npm install sqlite3 --build-from-source

echo "[DEBUG] Installing API via 'npm install'"
npm install

echo "[DEBUG] Final step via 'npm i -g ts-node'"
npm i -g ts-node

