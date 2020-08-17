## To Use

First, download and configure [Node.js](https://nodejs.org/en/download/).

Then you need to add the server's IP address to the AWS RDS, Firebase (fully open atm), and the config file (as templated).

Then we need to generate some SSL keys:

```bash
# building ssl keys
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=<serversIPAddress>' -keyout <nameForServer>-privkey.pem -out <nameForServer>-cert.pem
#both the privkey.pem and the cert.pem must be in backend/certs and only the cert.pem should to be in frontend/certs
```

Lastly, from your command line (in the backend directory):

```bash
# Install dependencies
npm install
# start the server
npm start
```

(in the frontend directory and a seperate console window):

```bash
# Install dependencies
npm install
# Run the app
npm start
```

## Relvant Commands

```bash
# (pre)Compiling a handlebars template
cd frontend/app/resources/Handlebars
handlebars example_object.handlebars -f example_object.precompiled.js
```

```bash
# Watch for changes to .scss files to build coresponding .css
cd frontend/app/css
sass --watch .
```

```bash
# Generate ssl keys for http2 examples
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost--privkey.pem -out localhost--cert.pem
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=192.168.1.57' -keyout joesmac-privkey.pem -out joesmac-cert.pem
```

## DB architecture:

Users: unique index email, username, password, platforms, refresh token, access token, date created, lastlogin \
Listens: unique index listenID, email, artists, album, title, year, platform, platform track ID, timestamp
