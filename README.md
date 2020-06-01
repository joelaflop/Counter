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

## todo

- [ ] DB support
    - [ ] Saving users
    - [ ] Users info
- [ ] Aesthetic
    - [ ] a lot
- [ ] Usability
    - [ ] Enter key to login
    - [ ] Save username/password locally
- [ ] Security
    - [x] seperate front- and back-end

## DB architecture:
Users: unique index userID, date created, email\
Listens: unique index listenID, userID, artists set, album, title, timestamp
