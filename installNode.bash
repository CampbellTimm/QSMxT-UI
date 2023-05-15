#!/bin/bash

mkdir nodejs12
cd nodejs12/
wget https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
tar xf node-v12.13.0-linux-x64.tar.xz
rm node-v12.13.0-linux-x64.tar.xz
echo "export PATH=`pwd`/node-v12.13.0-linux-x64/bin:${PATH}" >> ~/.bashrc
export PATH=`pwd`/node-v12.13.0-linux-x64/bin:${PATH}