## To Use

Download and configure [Node.js](https://nodejs.org/en/download/), then from your command line (in the backend directory):
```bash
# Install dependencies
npm install
# start the server
node server.js
```
(in the frontend directory and a seperate console window):
```bash
# Install dependencies
npm install
# Run the app
npm start
```

## todo

- [ ] DB support
    - [ ] Saving users
    - [ ] Users info
- [ ] UI design
- [ ] Usability
    - [ ] Enter key to login
    - [ ] Save username/password locally

## DB architecture:<br/>
Users: unique index ID, date created, email
Listens: unique index ID, artists set, album, ritle, timestamp
