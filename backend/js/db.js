const {
   Client
} = require('pg')

const client = new Client({
   user: 'postgres',
   host: 'counter-1.c4fxt0ukb7r1.us-east-2.rds.amazonaws.com',
   database: 'counter',
   password: 'counterDBpassword',
   port: 5432,
})
client.connect()


module.exports = {
   newUser: function(email, username, password, platforms, created_on, last_login) {
      query = `INSERT INTO account (email, username, password, platforms, created_on, last_login) VALUES ('${email}', '${username}','${password}','${platforms}',now(),now());`
      // console.log(query);
      client.query(query)
   },
   getTokens: function(email, callback) {
      query = `SELECT refresh_token, access_token from account where email = '${email}';`
      // console.log(query);
      client.query(query, function(err, res) {
         if (!err) {
            callback(res.rows[0].access_token, res.rows[0].refresh_token);
         }
      })
   },
   setTokens: function(email, access, refresh) {
      query = `UPDATE account SET refresh_token='${refresh}', access_token='${access}' WHERE email='${email}';`
      // console.log(query);
      client.query(query, function(err, res) {})
   },
   login: function(email){
      query = `UPDATE account SET last_login=now() WHERE email='${email}';`
      client.query(query, function(err, res) {})
   }

};
