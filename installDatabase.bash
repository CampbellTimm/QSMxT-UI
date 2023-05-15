#!/bin/bash

sudo apt-get update
sudo apt-get install postgresql postgresql-contrib -y
sudo service postgresql start

sudo -i -u postgres
createuser --password user2

