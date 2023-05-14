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

# API

Attach visual studio to docker instance and forward port 4000 to the instance

```bash
cd api/
npm install
npm i -g ts-node
```

To run: `ts-node index.ts`

# Frontend

Install node node on local machine

```bash
cd frontend
npm install
```

To run: `npm start`

