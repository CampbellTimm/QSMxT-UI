#!/bin/bash

cd frontend/
cd build/ && python3 -m http.server 8080 &
cd ../../api

ts-node index.ts
