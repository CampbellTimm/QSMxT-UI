# QSMxT-UI

Prerequisites -> Install node v12.13

```bash
mkdir nodejs12
cd nodejs12/
wget https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz
tar xf node-v12.13.0-linux-x64.tar.xz
rm node-v12.13.0-linux-x64.tar.xz
echo "export PATH=`pwd`/node-v12.13.0-linux-x64/bin:${PATH}" >> ~/.bashrc
source ~/.bashrc
```

```bash
$ node --version
v12.13.0
$ npm --version
6.12.0
```

# Database
```bash
cd api/
sudo apt-get update
sudo apt-get install libsqlite3-dev
npm install sqlite3 --build-from-source
```

# API

Attach visual studio to docker instance and forward port 4000 to the instance

```bash
cd api/
npm install
npm install -g ts-node
```

To run: `ts-node index.ts`

# Frontend

Install node node on local machine

```bash
cd frontend
npm install
```

To run: `cd build/ && python3 -m http.server 8080`

