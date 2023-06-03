#!/bin/bash

sudo service postgresql start
sudo su -
su - postgres
psql -U postgres -f ./scripts/createDatabaseAndUser.sql
