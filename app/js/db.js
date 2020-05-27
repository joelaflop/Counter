const {
   Client
} = require('pg')

const client = new Client({
   user: 'postgres',
   host: 'counter-1.c4fxt0ukb7r1.us-east-2.rds.amazonaws.com',
   database: 'counter',
   password: 'counterdbpass',
   port: 5432,
})
client.connect()


module.exports = {
   newUser() {

   },
   getUser() {

   }
};
