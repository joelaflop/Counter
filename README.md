## To Use

Download and configure [Node.js](https://nodejs.org/en/download/), then from your command line (in the backend directory):

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

## DB architecture:

Users: unique index email, username, password, platforms, refresh token, access token, date created, lastlogin \
Listens: unique index listenID, email, artists, album, title, year, platform, platform track ID, timestamp
