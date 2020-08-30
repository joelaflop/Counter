const {
   Client
} = require('pg')
const { exists } = require('fs')
const { exit } = require('process')

const client = new Client({
   user: 'postgres',
   host: 'counter-1.c4fxt0ukb7r1.us-east-2.rds.amazonaws.com',
   database: 'counter',
   password: 'counterDBpassword',
   port: 5432,
})

client.connect((err) => {
   if (err) {
      console.log('Error connecting to database:')
      console.log(err);
      console.log('Exitting backend due to fatal error ^')
      exit(-1);
   } else {
      console.log('Connected to DB')
   }

})


module.exports = {
   newUser: function (email, username, password, platforms) {
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
      client.query(query, values, function (err, res) {
         if (err) {
            console.log('DB: error adding user');
            console.log(err)
         }
      })
   },
   getTokens: function (email, callback) {
      query = `SELECT refresh_token, access_token from account where email = $1;`
      // console.log(query);
      values = [email]
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows[0].access_token, res.rows[0].refresh_token);
         } else if (!err && !res.rows[0]) {
            callback(null, null)
         } else {
            console.log('DB: error getting tokens');
            console.log(err)
         }
      })
   },
   setTokens: function (email, access, refresh, noUserCallback) {
      query = `UPDATE account SET refresh_token= $1, access_token= $2 WHERE email= $3;`
      values = [refresh, access, email]
      // console.log(query);
      client.query(query, values, function (err, res) {
         if (res.rowCount == 0) {
            console.log('setting coins for user not in DB')
            noUserCallback();
            //should consider removing user from auth to force resignup
         }
         if (err) {
            console.log('DB: error setting tokens');
            console.log(err)

         }
      })
   },
   login: function (email, noUserCallback) {
      query = `UPDATE account SET last_login=now() WHERE email= $1;`
      values = [email]
      client.query(query, values, function (err, res) {
         if (res.rowCount == 0) {
            console.log('setting coins for user not in DB')
            noUserCallback();
            //consider removing user from auth to force resignup
         }
         if (err) {
            console.log('DB: error updating login time');
            console.log(err)
         }
      })
   },
   listen: function (email, tracks) {
      innerquery = ''
      values = []
      for (i = 0; i < tracks.items.length; i++) {
         curr = tracks.items[i]
         track = curr.track;
         artists_count = track.artists.length;
         artists = ''
         artistsids = ''
         for (j = 0; j < track.artists.length; j++) {
            if (j === 0) {
               artists += (track.artists[j].name);
               artistsids += (track.artists[j].id);
            } else {
               artists += ('\n' + track.artists[j].name);
               artistsids += ('\n' + track.artists[j].id);
            }

         }
         // console.log(JSON.stringify(track.name))
         if (i == 0) {
            innerquery = `(DEFAULT, $${i * 11 + 1}, $${i * 11 + 2}, $${i * 11 + 3}, $${i * 11 + 4}, $${i * 11 + 5}, $${i * 11 + 6}, $${i * 11 + 7}, $${i * 11 + 8}, $${i * 11 + 9}, $${i * 11 + 10}, $${i * 11 + 11}) \n`
         } else {
            innerquery += `, (DEFAULT, $${i * 11 + 1}, $${i * 11 + 2}, $${i * 11 + 3}, $${i * 11 + 4}, $${i * 11 + 5}, $${i * 11 + 6}, $${i * 11 + 7}, $${i * 11 + 8}, $${i * 11 + 9}, $${i * 11 + 10}, $${i * 11 + 11}) \n`
         }

         values.push(email
            , artists_count
            , artists
            , artistsids
            , track.album.name
            , track.album.id
            , track.name
            , track.id
            , handleSpotifyTimestamps(track.album.release_date, track.album.release_date_precision)
            , 'spotify'
            , curr.played_at);
      }
      query = `
               INSERT INTO listen (listen_id
                                 , email
                                 , artists_count
                                 , artists
                                 , platform_artistID
                                 , album
                                 , platform_albumID
                                 , title
                                 , platform_trackID
                                 , released_on
                                 , platform
                                 , listened_on)
               VALUES ${innerquery}
               on conflict (email, listened_on) do nothing;`
      // console.log(query);
      client.query(query, values, function (err, res) {
         if (err) {
            console.log('DB: error listening to tracks');
            console.log(err)
            console.log(query)
         }
      })
   },
   getEmail: function (username, callback) {
      query = `SELECT email FROM account WHERE username = $1;`
      // console.log(query);
      values = [username]
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows[0].email);
         } else if (!err && !res.rows[0]) {
            callback(null)
         } else {
            console.log('DB: error getting username from email');
            console.log(err)
         }
      })
   },
   checkAuth: function (email, callback) {
      query = `SELECT refresh_token, access_token FROM account WHERE email = $1`
      values = [email]
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(true);
         } else if (!err && !res.rows[0]) {
            callback(false)
         } else {
            console.log(`DB: error checking auth for ${email}`);
            console.log(err)
         }
      });
   },
   getUserInfo: function (email, callback) {
      query = `select email, username, platforms, created_on, last_login
               from account 
               where email = $1`;
      values = [email];
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows[0]);
         } else if (!err && !res.rows[0]) {
            callback(null)
         } else {
            console.log(`DB: error getting user info for ${email}`);
            console.log(err)
         }
      })
   },
   getPlayCounts: function (email, days, count, type, callback) {
      var query;
      if (type === 'artists') {
         // console.log('getting artists')
         query = `select * from public.artistcounts($1, $2, $3);`;
      } else if (type === 'albums') {
         // console.log('getting albums')
         query = `select * from public.albumcounts($1, $2, $3);`;
      } else if (type === 'songs') {
         // console.log('getting songs')
         query = `select * from public.songcounts($1, $2, $3);`;
      } else {
         throw new Error('unrecognized type for play counts!')
      }

      values = [email, days, count];
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows);
         } else if (!err && !res.rows) {
            callback(null);
         } else {
            console.log(`DB: error getting counts info for ${email}`);
            console.log(err)
         }
      })
   },
   getArtistSteamGraph(email, days, count, type, callback) {
      query;
      if(type == 'weekly'){
         query = `select * from public.top_artists_overtime_week($1, $2, $3)`;
      } else if (type == 'monthly'){
         query = `select * from public.top_artists_overtime_month($1, $2, $3)`;
      } else {
         console.log(`artist steam graph does not suppport type: ${type}`)
         callback(null);
         return;
      }
      
      values = [email, days, count];
      client.query(query, values, function (err, res) {
         if (!err && res.rows[0]) {
            callback(res.rows);
         } else if (!err && !res.rows) {
            callback(null);
         } else {
            console.log(`DB: error getting counts info for ${email}`);
            console.log(err)
         }
      });
      
   }
};

function handleSpotifyTimestamps(txt, precision) {
   if (precision == 'year') {
      return txt + '-01-01'
   } else if (precision == 'month') {
      return txt + '-01'
   } else {
      return txt;
   }
}
