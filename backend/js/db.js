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
   newUser: function(email, username, password, platforms) {
      query = `INSERT INTO account (email
                                  , username
                                  , password
                                  , platforms
                                  , created_on
                                  , last_login)
               VALUES ( $1
                      , $2
                      , $3
                      , $4
                      , now()
                      , now())
               ON CONFLICT (email)
               DO UPDATE SET email= $1
                           , username= $2
                           , password= $3
                           , platforms= $4
                           , created_on=now()
                           , last_login=now();`
      values = [email, username, password, platforms]
      client.query(query, values, function(err, res) {
         if (err) {
            console.log('DB: error adding user');
            console.log(err)
         }
      })
   },
   getTokens: function(email, callback) {
      query = `SELECT refresh_token, access_token from account where email = $1;`
      // console.log(query);
      values = [email]
      client.query(query, values, function(err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows[0].access_token, res.rows[0].refresh_token);
         } else if (!err && !res.rows[0]) {
            callback(null,null)
         } else {
            console.log('DB: error getting tokens');
            console.log(err)
         }
      })
   },
   setTokens: function(email, access, refresh) {
      query = `UPDATE account SET refresh_token= $1, access_token= $2 WHERE email= $3;`
      values = [refresh, access, email]
      // console.log(query);
      client.query(query, values, function(err, res) {
         if(res.rowCount == 0){
            console.log('setting coins for user not in DB')
            //should consider removing user from auth to force resignup
         }
         if (err) {
            console.log('DB: error setting tokens');
            console.log(err)

         }
      })
   },
   login: function(email) {
      query = `UPDATE account SET last_login=now() WHERE email= $1;`
      values = [email]
      client.query(query, values, function(err, res) {
         if(res.rowCount == 0){
            console.log('setting coins for user not in DB')
            //should consider removing user from auth to force resignup
         }
         if (err) {
            console.log('DB: error updating login time');
            console.log(err)
         }
      })
   },
   listen: function(email, tracks) {
      innerquery = ''
      values = []
      for (i = 0; i < tracks.items.length; i++) {
         curr = tracks.items[i]
         track = curr.track;
         artists = ''
         for (j = 0; j < track.artists.length; j++) {
            artists += track.artists[j].name;
         }
         // console.log(JSON.stringify(track.name))
         if (i == 0) {
            innerquery = `(DEFAULT, $${i*8+1}, $${i*8+2}, $${i*8+3}, $${i*8+4}, $${i*8+5}, $${i*8+6}, $${i*8+7}, $${i*8+8}) \n`
         } else {
            innerquery += `, (DEFAULT, $${i*8+1}, $${i*8+2}, $${i*8+3}, $${i*8+4}, $${i*8+5}, $${i*8+6}, $${i*8+7}, $${i*8+8}) \n`
         }

         values.push(email
                   , artists
                   , track.album.name
                   , track.name
                   , handleSpotifyTimestamps(track.album.release_date, track.album.release_date_precision)
                   , 'spotify'
                   , track.id
                   , curr.played_at);
      }
      query = `
               INSERT INTO listen (listen_id
                                 , email
                                 , artists
                                 , album
                                 , title
                                 , released_on
                                 , platform
                                 , platform_trackID
                                 , listened_on)
               VALUES ${innerquery}
               on conflict (email, listened_on) do nothing;`
      // console.log(query);
      client.query(query, values, function(err, res) {
         if (err) {
            console.log('DB: error listening to track');
            console.log(err)
            console.log(query)
         }
      })
   }
};

function handleSpotifyTimestamps(txt) {
   return txt.replace(/'/g, '');
}
