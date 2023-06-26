#!/bin/bash

cd frontend
npm install
npm build
cd ..

cd api
sudo apt-get update
sudo apt-get install libsqlite3-dev
npm install sqlite3 --build-from-source
npm install
npm i -g ts-node


